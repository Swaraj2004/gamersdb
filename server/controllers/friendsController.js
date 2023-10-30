const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const asyncHandler = require("express-async-handler");

// @desc Get all friends
// @route GET /user/friends
// @access Private
const getAllFriends = asyncHandler(async (req, res) => {
    const userId = req.query.uid;

    // Confirm data
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User ID is required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId)
        .populate("friends", "username profileImg")
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
// @route POST /user/friends/requests
// @access Private
const sendRequest = asyncHandler(async (req, res) => {
    const { uid: userId, fname: friendName } = req.body;

    // Confirm data
    if (!userId || !friendName) {
        return res.status(400).json({
            message: "All fields are required",
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
        message: "Friend request sent successfully",
        success: true,
    });
});

// @desc Get sent and recieved requests
// @route GET /user/friends/requests
// @access Private
const getRequests = asyncHandler(async (req, res) => {
    const userId = req.query.uid;

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

    const sentRequests = await FriendRequest.find({ sender: userId })
        .populate("recipient", "username profileImg")
        .lean();
    const receivedRequests = await FriendRequest.find({ recipient: userId })
        .populate("sender", "username profileImg")
        .lean();

    res.json({ result: { sentRequests, receivedRequests }, success: true });
});

// @desc Accept friend request
// @route POST /user/friends/requests/accept
// @access Private
const acceptRequest = asyncHandler(async (req, res) => {
    const { uid: userId, reqid: requestId } = req.body;

    // Confirm data
    if (!userId || !requestId) {
        return res.status(400).json({
            message: "All fields are is required",
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

    res.json({
        message: "Friend request accepted successfully",
        success: true,
    });
});

// @desc Reject friend request
// @route DELETE /user/friends/requests/reject
// @access Private
const rejectRequest = asyncHandler(async (req, res) => {
    const { uid: userId, reqid: requestId } = req.query;

    // Confirm data
    if (!userId || !requestId) {
        return res.status(400).json({
            message: "All fields are required",
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

    res.json({
        message: "Friend request rejected successfully",
        success: true,
    });
});

// @desc Remove a friend
// @route DELETE /user/friends/remove
// @access Private
const removeFriend = asyncHandler(async (req, res) => {
    const { uid: userId, fid: friendId } = req.query;

    // Confirm data
    if (!userId || !friendId) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    // Check if user & friend exists
    const user = await User.findById(userId)
        .populate("collections", "sharedWith")
        .exec();
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

    // Remove shared collections
    friend.sharedCollections = friend.sharedCollections.filter(
        (collectionId) => !user.collections.includes(collectionId)
    );
    user.sharedCollections = user.sharedCollections.filter(
        (collectionId) => !friend.collections.includes(collectionId)
    );

    // Remove friendId from sharedWith in each collection of user
    user.collections.forEach((collection) => {
        collection.sharedWith = collection.sharedWith.filter(
            (friendId) => friendId.toString() !== friend._id.toString()
        );
    });

    await user.save();
    await friend.save();

    res.json({
        message: `Friend removed successfully`,
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
