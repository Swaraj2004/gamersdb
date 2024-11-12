const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const isBase64 = require("is-base64");
const jwt = require("jsonwebtoken");

// Utility functions to generate tokens
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Login user and issue JWT tokens
// @route POST /user/login
// @access Public
const getUser = asyncHandler(async (req, res) => {
    const { username: name, email: mail, password: pass } = req.body;

    // Confirm data
    if (!((name && pass) || (mail && pass))) {
        return res
            .status(400)
            .json({ message: "All fields are required.", success: false });
    }

    // Check if user exists
    let user;
    if (name) {
        user = await User.findOne({ username: name }).exec();
    } else if (mail) {
        user = await User.findOne({ email: mail }).exec();
    }
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found.", success: false });
    }

    // Check if password is correct
    const passwordEquals = await bcrypt.compare(pass, user.password);
    if (!passwordEquals) {
        return res
            .status(401)
            .json({ message: "Password is invalid.", success: false });
    }

    // Issue JWT tokens
    const accessToken = generateAccessToken({
        _id: user._id,
        email: user.email,
    });
    const refreshToken = generateRefreshToken({
        _id: user._id,
        email: user.email,
    });

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
        success: true,
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
        },
    });
});

// @desc Refresh JWT access token
// @route POST /user/refresh-token
// @access Public
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Confirm data
    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token required." });
    }

    // Check if refresh token is valid
    const user = await User.findOne({ refreshToken }).exec();

    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token." });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
                return res
                    .status(403)
                    .json({ message: "Invalid refresh token." });

            const newAccessToken = generateAccessToken({
                _id: decoded._id,
                email: decoded.email,
            });
            res.json({ accessToken: newAccessToken });
        }
    );
});

// @desc Logout user
// @route POST /user/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Confirm data
    const user = await User.findOne({ refreshToken }).exec();
    if (user) {
        // Remove refresh token from user record in the database
        user.refreshToken = null;
        await user.save();
    }

    res.status(204).json({ message: "Logged out successfully." });
});

// @desc Create Register user
// @route POST /user
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Confirm data
    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ message: "All fields are required.", success: false });
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
                "Username is invalid. It should contain only letters, numbers, and underscores.",
            success: false,
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
            message: "Email is invalid.",
            success: false,
        });
    }

    // Check if password valid
    if (password.length < 8) {
        return res.status(400).json({
            message: "The password needs to be at least 8 characters long.",
            success: false,
        });
    }

    // Check for duplicate username and email
    const duplicateUser = await User.findOne({ username }).lean().exec();
    if (duplicateUser) {
        return res
            .status(409)
            .json({ message: "Username already exists.", success: false });
    }
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) {
        return res
            .status(409)
            .json({ message: "Email already used.", success: false });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = { username, email, password: hashedPwd };

    // Create and store new user
    await User.create(userObject);

    res.status(201).json({
        message: "User registered successfully.",
        success: true,
    });
});

// @desc Update a user
// @route PATCH /user
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { uid: userId, username, email, profileImg } = req.body;

    // Confirm data
    if (!userId || !username || !email) {
        return res.status(400).json({
            message: "All fields except password are required.",
            success: false,
        });
    }

    // Check if user exists to update
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found.", success: false });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== userId) {
        return res
            .status(409)
            .json({ message: "Username already exists.", success: false });
    }

    if (profileImg) {
        // Image validation
        if (!isBase64(profileImg, { allowMime: true, allowEmpty: false })) {
            return res
                .status(400)
                .json({ message: "Image is invalid.", success: false });
        }
        user.profileImg = profileImg;
    }
    user.username = username;
    user.email = email;

    // Update user
    await user.save();

    res.json({
        message: "User profile updated successfully.",
        success: true,
    });
});

// @desc Update user password
// @route PATCH /user/password
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
    const { uid: userId, password: pass, newPassword } = req.body;

    // Confirm data
    if (!userId || !pass || !newPassword) {
        return res.status(400).json({
            message: "All fields are required.",
            success: false,
        });
    }

    // Check if user exists to update
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found.", success: false });
    }

    // Check if password is correct
    const passwordEquals = await bcrypt.compare(pass, user.password);
    if (!passwordEquals) {
        return res.status(401).json({
            message: "Password is invalid.",
            success: false,
        });
    }

    // Hash password
    user.password = await bcrypt.hash(newPassword, 10);

    // Update user
    await user.save();

    res.json({
        message: "Password updated successfully.",
        success: true,
    });
});

// @desc Delete a user
// @route DELETE /user
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { password: pass } = req.query;

    // Confirm data
    if (!userId || !pass) {
        return res
            .status(400)
            .json({ message: "All fields are required.", success: false });
    }

    // Check if user exists to delete
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found.", success: false });
    }

    // Check if password is correct
    const passwordEquals = await bcrypt.compare(pass, user.password);
    if (!passwordEquals) {
        return res.status(401).json({
            message: "Password is invalid.",
            success: false,
        });
    }

    // Delete collections of user
    await Collection.deleteMany({
        owner: userId,
    });

    // Delete user
    await user.deleteOne();

    res.json({
        message: "User deleted successfully.",
        success: true,
    });
});

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    updatePassword,
    deleteUser,
    refreshToken,
    logout,
};
