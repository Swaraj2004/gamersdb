const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const isBase64 = require("is-base64");

// @desc Login user
// @route GET /user
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const { username, email, password: pass } = req.body;

    // Confirm data
    if (!((username && pass) || (email && pass))) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    let user;
    if (username) {
        user = await User.findOne({ username }).lean();
    } else if (email) {
        user = await User.findOne({ email }).lean();
    }
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const passwordEquals = await bcrypt.compare(pass, user.password);
    if (!passwordEquals) {
        return res.status(401).json({
            message: "Password is invalid",
        });
    }

    // Remove password and document version
    const { password, __v, ...data } = user;

    res.json(data);
});

// @desc Create Register user
// @route POST /user
// @access Public
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
        return res.status(401).json({
            message:
                "Username is invalid. It should contain only letters, numbers, and underscores",
        });
    }

    // Check if email valid
    const isValidEmail = (email) => {
        // Define a regular expression pattern for valid emails
        const usernamePattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        // Test the email against the pattern
        return usernamePattern.test(email);
    };
    if (!isValidEmail(email)) {
        return res.status(401).json({
            message: "Email is invalid",
        });
    }

    // Check if password valid
    if (password.length < 8) {
        return res.status(400).json({
            message: "The password needs to be at least 8 characters long",
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

    res.status(201).json({
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
    const { id, password: pass } = req.body;

    // Confirm data
    if (!id || !pass) {
        return res.status(400).json({ message: "User ID Required" });
    }

    // Check if user exists to delete
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const passwordEquals = await bcrypt.compare(pass, user.password);
    if (!passwordEquals) {
        return res.status(401).json({
            message: "Password is invalid",
        });
    }

    // Delete collections of user
    await Collection.deleteMany({
        owner: id,
    });

    // Delete user
    const deletedUser = await user.deleteOne();

    res.json({
        message: `User ${deletedUser.username} deleted`,
    });
});

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
};
