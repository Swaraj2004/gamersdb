const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all friends
// @route GET /user/friends
// @access Private
const getAllFriends = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(id)
        .select("-password")
        .populate("friends")
        .lean();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Get all friends from friends array
    const friends = user.friends;

    // If no friends
    if (!friends?.length) {
        return res.status(200).json({ message: "No friends found" });
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
        return res.status(400).json({ message: "Username required" });
    }

    // Check for user
    const users = await User.find({ username }).limit(10).lean().exec();
    if (!users.length) {
        return res.status(409).json({ message: "User not found" });
    }

    res.json(users);
});

// @desc Add a friend
// @route POST /user/friends
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
        return res.status(404).json({ message: "User not found" });
    }

    // Check if friend already added
    if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already added" });
    }

    //Add friend
    user.friends.push(friend);
    await user.save();

    res.json({ message: `Friend with username ${friend.username} added` });
});

// @desc Remove a friend
// @route DELETE /user/friends
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
        return res.status(404).json({ message: "User not found" });
    }

    // Check if friend is not added
    if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend not added" });
    }

    // Remove friend
    user.friends = user.friends.filter(
        (userfriendId) => userfriendId.toString() !== friendId
    );
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
