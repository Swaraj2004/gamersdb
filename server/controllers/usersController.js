const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select("-password").lean();

    // If no users
    if (!users?.length) {
        return res.status(400).json({ message: "No users found" });
    }

    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Confirm data
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
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

    if (user) {
        //created
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, password } = req.body;

    // Confirm data
    if (!id || !username || !email) {
        return res
            .status(400)
            .json({ message: "All fields except password are required" });
    }

    // Check if user exists to update
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Username already exists" });
    }

    user.username = username;
    user.email = email;

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
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
        return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne();

    res.json({
        message: `Username ${result.username} with ID ${result._id} deleted`,
    });
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
