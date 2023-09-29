const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all friends
// @route GET /user/friends
// @access Private
const getAllFriends = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Get all friends from MongoDB
    const user = await User.findById(id).populate("friends").lean();
    const friends = user.friends;

    // If no friends
    if (!friends?.length) {
        return res.status(400).json({ message: "No friends found" });
    }

    res.json(friends);
});

// @desc Search friend
// @route GET /user/search
// @access Private
const searchFriend = asyncHandler(async (req, res) => {
    const { username } = req.body;

    // Confirm data
    if (!username) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for users
    const users = await User.find({ username }).lean().exec();
    if (!users.length) {
        return res.status(409).json({ message: "No users found" });
    }

    res.json(users);
});

// @desc Add a friend
// @route PATCH /user/addfriend
// @access Private
const addFriend = asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body;

    // Confirm data
    if (!userId || !friendId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (userId === friendId) {
        return res
            .status(400)
            .json({ message: "Can not add yourself to friends" });
    }

    // Check if user & friend exists
    const user = await User.findById(userId).exec();
    const friend = await User.findById(friendId).exec();
    if (!user || !friend) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check if friend already added
    if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already added" });
    }

    //Add friend
    user.friends.push(friend);
    await user.save();

    res.json({ message: `Friend with username ${friend.username} added.` });
});

// @desc Remove a friend
// @route PATCH /user/removefriend
// @access Private
const removeFriend = asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body;

    // Confirm data
    if (!userId || !friendId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user & friend exists
    const user = await User.findById(userId).exec();
    const friend = await User.findById(friendId).exec();
    if (!user || !friend) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check if friend is not added
    if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend not added" });
    }

    // Remove friend
    for (let i = 0; i < user.friends.length; i++) {
        if (user.friends[i].toString() === friendId) {
            user.friends.splice(i, 1);
        }
    }
    await user.save();

    res.json({
        message: `Friend with username ${friend.username} removed`,
    });
});

module.exports = {
    getAllFriends,
    searchFriend,
    addFriend,
    removeFriend,
};
