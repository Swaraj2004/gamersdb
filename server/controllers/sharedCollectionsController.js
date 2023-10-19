const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");

// @desc Get all shared collections
// @route GET /user/collection/share/:uid
// @access Private
const getAllSharedCollections = asyncHandler(async (req, res) => {
    const userId = req.params.uid;

    // Confirm data
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User ID is required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId)
        .populate({
            path: "sharedCollections",
            populate: { path: "owner", select: "_id, username" },
        })
        .lean();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Get all shared collections
    let shared = user.sharedCollections.map((collection) => {
        return {
            _id: collection._id,
            name: collection.name,
            owner: collection.owner,
            games: collection.games,
        };
    });

    // If no shared collections
    if (!shared?.length) {
        return res
            .status(200)
            .json({ message: "No shared collections found", success: false });
    }

    res.json({ result: shared, success: true });
});

// @desc Share collection
// @route POST /user/collection/share
// @access Private
const shareCollection = asyncHandler(async (req, res) => {
    const { userId, friendId, collectionId } = req.body;

    // Confirm data
    if (!userId || !friendId || !collectionId) {
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

    // Check if collection exists
    const collection = await Collection.findById(collectionId);
    if (!collection) {
        return res
            .status(404)
            .json({ message: "Collection not found", success: false });
    }

    // Check if friend is not added
    const friendInArr = user.friends.some(function (friendInArr) {
        return friendInArr.equals(friend._id);
    });
    if (!friendInArr) {
        return res
            .status(400)
            .json({ message: "Friend not added", success: false });
    }

    // Check if collection already shared
    const collectionInSharedArr = friend.sharedCollections.some(function (
        sharedCollectionInArr
    ) {
        return sharedCollectionInArr.equals(collection._id);
    });
    if (collectionInSharedArr) {
        return res
            .status(400)
            .json({ message: "Collection already shared", success: false });
    }

    // Push collection to friend's sharedCollections
    friend.sharedCollections.push(collectionId);
    await friend.save();

    // Push friendId to sharedWith array in Collection
    collection.sharedWith.push(friendId);
    await collection.save();

    res.json({
        message: `Collection shared with ${friend.username}`,
        success: true,
    });
});

// @desc Remove shared collection
// @route DELETE /user/collection/share
// @access Private
const removeSharedCollection = asyncHandler(async (req, res) => {
    const { userId, friendId, collectionId } = req.body;

    // Confirm data
    if (!friendId || !collectionId) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    // Check if collection exists
    const collection = await Collection.findById(collectionId);
    if (!collection) {
        return res
            .status(404)
            .json({ message: "Collection not found", success: false });
    }

    // Check if friend exists
    const friend = await User.findById(friendId).exec();
    if (!friend) {
        return res.status(404).json({
            message: `User with friendId ${friendId} not found`,
            success: false,
        });
    }

    if (userId) {
        // Check if user exists
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({
                message: `User with userId ${userId} not found`,
                success: false,
            });
        }

        // Check if user is the owner
        if (userId !== collection.owner.toString()) {
            return res.status(400).json({
                message: "User is not the owner of the collection",
                success: false,
            });
        }

        // Check if friend is not added
        const friendInArr = user.friends.some(function (friendInArr) {
            return friendInArr.equals(friendId);
        });
        if (!friendInArr) {
            return res
                .status(400)
                .json({ message: "Friend not added", success: false });
        }
    }

    // Check if collection already shared
    const collectionInSharedArr = friend.sharedCollections.some(function (
        sharedCollectionInArr
    ) {
        return sharedCollectionInArr.equals(collectionId);
    });
    if (!collectionInSharedArr) {
        return res
            .status(400)
            .json({ message: "Collection not shared", success: false });
    }

    // Remove shared collection
    friend.sharedCollections = friend.sharedCollections.filter(
        (sharedCollectionId) => sharedCollectionId.toString() !== collectionId
    );

    // Remove friendId from sharedWith array in collection
    collection.sharedWith = collection.sharedWith.filter(
        (sharedWithId) => sharedWithId.toString() !== friendId
    );

    await friend.save();
    await collection.save();

    res.json({
        message: "Collection unshared",
        success: true,
    });
});

module.exports = {
    getAllSharedCollections,
    shareCollection,
    removeSharedCollection,
};
