const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const isBase64 = require("is-base64");

// @desc Get user data
// @route GET /user
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// @desc Create new user
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Confirm data
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username valid
    const isValidUsername = (username) => {
        // Define a regular expression pattern for valid usernames
        const usernamePattern = /^[a-zA-Z0-9_]+$/;

        // Test the username against the pattern
        return usernamePattern.test(username);
    };
    if (!isValidUsername(username)) {
        return res.status(409).json({
            message:
                "Username is invalid. It should contain only letters, numbers, and underscores",
        });
    }

    // Check for duplicate username and email
    const duplicateUser = await User.findOne({ username }).lean().exec();
    if (duplicateUser) {
        return res.status(409).json({ message: "Username already exists" });
    }
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) {
        return res.status(409).json({ message: "Email already used" });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = { username, email, password: hashedPwd };

    // Create and store new user
    const user = await User.create(userObject);

    res.json({
        message: `New user ${user.username} created`,
    });
});

// @desc Update a user
// @route PATCH /user
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, password, profileImg } = req.body;

    // Confirm data
    if (!id || !username || !email) {
        return res
            .status(400)
            .json({ message: "All fields except password are required" });
    }

    // Check if user exists to update
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Username already exists" });
    }

    if (profileImg) {
        // Image validation
        if (!isBase64(profileImg, { allowMime: true, allowEmpty: false })) {
            return res.status(400).json({ message: "Invalid image" });
        }
        user.profileImg = profileImg;
    }
    user.username = username;
    user.email = email;
    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await user.save();

    res.json({
        message: `User ${updatedUser.username} updated`,
    });
});

// @desc Delete a user
// @route DELETE /user
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: "User ID Required" });
    }

    // Check if user exists to delete
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Delete collections of user
    const deletedCollections = await Collection.deleteMany({
        owner: id,
    });

    // Delete user
    const deletedUser = await user.deleteOne();

    res.json({
        message: `User ${deletedUser.username} deleted`,
        deletedCollections,
    });
});

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
};
