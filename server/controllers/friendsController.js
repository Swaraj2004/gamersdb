const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const asyncHandler = require("express-async-handler");

// @desc Get all friends
// @route GET /user/friends
// @access Private
const getAllFriends = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Confirm data
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User ID is required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId)
        .populate("friends", "username")
        .lean();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Get all friends from friends array
    const friends = user.friends;

    // If no friends
    if (!friends?.length) {
        return res
            .status(200)
            .json({ message: "No friends found", success: false });
    }

    res.json({ result: friends, success: true });
});

// @desc Send friend request
// @route POST /user/friend/add
// @access Private
const sendRequest = asyncHandler(async (req, res) => {
    const { userId, friendName } = req.body;

    // Confirm data
    if (!userId || !friendName) {
        return res.status(400).json({
            message: "UserId and friendName required",
            success: false,
        });
    }

    // Check if user exists
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check if username exists
    const friend = await User.findOne({ username: friendName }).lean().exec();
    if (!friend) {
        return res
            .status(404)
            .json({ message: "Username is not correct", success: false });
    }

    // Dont send request to same user
    if (user.username == friendName) {
        return res.status(400).json({
            message: "Can not send request to yourself",
            success: false,
        });
    }

    // Check if request already sent
    const existingRequest = await FriendRequest.findOne({
        sender: userId,
        recipient: friend._id,
    }).lean();
    if (existingRequest) {
        return res
            .status(400)
            .json({ message: "Friend request already sent", success: false });
    }

    // Check if already friends
    const isInArr = user.friends.some(function (friendInArr) {
        return friendInArr.equals(friend._id);
    });
    if (isInArr) {
        return res
            .status(400)
            .json({ message: "Friend already added", success: false });
    }

    // Create a friend request
    await FriendRequest.create({
        sender: userId,
        recipient: friend._id,
        status: "pending",
    });

    res.status(201).json({
        message: "Friend request sent",
        success: true,
    });
});

// @desc Get sent and recieved requests
// @route GET /user/friend/requests
// @access Private
const getRequests = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Confirm data
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User ID is required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    const sentRequests = await FriendRequest.find({ sender: userId });
    const receivedRequests = await FriendRequest.find({ recipient: userId });

    res.json({ result: { sentRequests, receivedRequests }, success: true });
});

// @desc Accept friend request
// @route POST /user/friend/accept
// @access Private
const acceptRequest = asyncHandler(async (req, res) => {
    const { userId, requestId } = req.body;

    // Confirm data
    if (!userId || !requestId) {
        return res.status(400).json({
            message: "UserId and requestId is required",
            success: false,
        });
    }

    // Check if user & request exists
    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }
    const request = await FriendRequest.findById(requestId);
    if (!request) {
        return res
            .status(404)
            .json({ message: "Request not found", success: false });
    }

    // Check if user is the recipient of the request
    if (userId !== request.recipient.toString()) {
        return res.status(400).json({
            message: "User is not the recipient of the request",
            success: false,
        });
    }

    // Update sender and recipient's friends list
    await User.findByIdAndUpdate(request.sender, {
        $push: { friends: request.recipient },
    });
    await User.findByIdAndUpdate(request.recipient, {
        $push: { friends: request.sender },
    });

    // Delete the request
    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: "Friend request accepted", success: true });
});

// @desc Reject friend request
// @route POST /user/friend/reject
// @access Private
const rejectRequest = asyncHandler(async (req, res) => {
    const { userId, requestId } = req.body;

    // Confirm data
    if (!userId || !requestId) {
        return res.status(400).json({
            message: "UserId and requestId is required",
            success: false,
        });
    }

    // Check if user & request exists
    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }
    const request = await FriendRequest.findById(requestId);
    if (!request) {
        return res
            .status(404)
            .json({ message: "Request not found", success: false });
    }

    // Check if user is the recipient of the request
    if (userId !== request.recipient.toString()) {
        return res.status(400).json({
            message: "User is not the recipient of the request",
            success: false,
        });
    }

    // Delete the request
    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: "Friend request rejected", success: true });
});

// @desc Remove a friend
// @route DELETE /user/friend/remove
// @access Private
const removeFriend = asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body;

    // Confirm data
    if (!userId || !friendId) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    // Check if user & friend exists
    const user = await User.findById(userId).exec();
    const friend = await User.findById(friendId).exec();
    if (!user || !friend) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check if friend is not added
    const isInArr = user.friends.some(function (friendInArr) {
        return friendInArr.equals(friend._id);
    });
    if (!isInArr) {
        return res
            .status(400)
            .json({ message: "Friend not added", success: false });
    }

    // Remove friend
    user.friends = user.friends.filter(
        (userfriendId) => userfriendId.toString() !== friendId
    );
    friend.friends = friend.friends.filter(
        (friendUserId) => friendUserId.toString() !== userId
    );

    await user.save();
    await friend.save();

    res.json({
        message: `Friend with username ${friend.username} removed`,
        success: true,
    });
});

module.exports = {
    getAllFriends,
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest,
    removeFriend,
};
