const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");

// @desc Get all collections
// @route GET /user/collections
// @access Private
const getAllCollections = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Get all collections
    const collections = await Collection.find({ owner: userId })
        .populate("owner", "username")
        .lean()
        .exec();

    // If no collections
    if (!collections?.length) {
        return res
            .status(200)
            .json({ message: "No collections found", success: false });
    }

    res.json({ result: collections, success: true });
});

// @desc Create a collection
// @route POST /user/collections
// @access Private
const createNewCollection = asyncHandler(async (req, res) => {
    const { userId, name } = req.body;

    // Confirm data
    if (!userId || !name) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check for duplicate collection name
    const duplicate = await Collection.findOne({ name })
        .where("owner")
        .equals(userId)
        .lean()
        .exec();
    if (duplicate) {
        return res
            .status(409)
            .json({ message: "Collection name already used", success: false });
    }

    // Create and store new collection
    const collectionObject = {
        name,
        owner: userId,
    };
    const collection = await Collection.create(collectionObject);

    // Add collection id to user's collections array
    user.collections.push(collection);
    await user.save();

    res.json({
        result: collection,
        message: `New collection created`,
        success: true,
    });
});

// @desc Update a collection
// @route PATCH /user/collections
// @access Private
const updateCollection = asyncHandler(async (req, res) => {
    const { id, name, userId } = req.body;

    // Confirm data
    if (!id || !name || !userId) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    // Check if collection exists to update
    const collection = await Collection.findById(id).exec();
    if (!collection) {
        return res
            .status(404)
            .json({ message: "Collection not found", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check if user is owner of the collection
    if (userId !== collection.owner.toString()) {
        return res.status(400).json({
            message: "User is not the owner of the collection",
            success: false,
        });
    }

    // Check for duplicate collection name
    const duplicate = await Collection.findOne({ name })
        .where("owner")
        .equals(userId)
        .lean()
        .exec();

    // Allow updates to the original collection
    if (duplicate && duplicate?._id.toString() !== id) {
        return res
            .status(409)
            .json({ message: "Collection name already used", success: false });
    }

    collection.name = name;

    const updatedCollection = await collection.save();

    res.json({
        result: updatedCollection,
        message: `Collection ${updatedCollection.name} updated`,
        success: true,
    });
});

// @desc Delete a collection
// @route DELETE /user/collections
// @access Private
const deleteCollection = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;

    // Confirm data
    if (!id || !userId) {
        return res
            .status(400)
            .json({ message: "Collection ID Required", success: false });
    }

    // Check if collection exists to delete
    const collection = await Collection.findById(id).exec();
    if (!collection) {
        return res
            .status(404)
            .json({ message: "Collection not found", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).exec();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check if user is owner of the collection
    if (userId !== collection.owner.toString()) {
        return res.status(400).json({
            message: "User is not the owner of the collection",
            success: false,
        });
    }

    // Remove collection
    user.collections = user.collections.filter(
        (userCollectionId) => userCollectionId.toString() !== id
    );
    await user.save();
    const deletedCollection = await collection.deleteOne();

    res.json({
        result: deletedCollection,
        message: `Collection ${deletedCollection.name} deleted`,
        success: true,
    });
});

// @desc Get all users to whom collection is shared
// @route GET /user/collection/sharedwith
// @access Private
const getCollectionSharedWith = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;

    // Confirm data
    if (!id || !userId) {
        return res
            .status(400)
            .json({ message: "Collection ID Required", success: false });
    }

    // Check if collection exists to delete
    const collection = await Collection.findById(id)
        .populate("sharedWith")
        .lean();
    if (!collection) {
        return res
            .status(404)
            .json({ message: "Collection not found", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).lean();
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found", success: false });
    }

    // Check if user is owner of the collection
    if (userId !== collection.owner.toString()) {
        return res.status(400).json({
            message: "User is not the owner of the collection",
            success: false,
        });
    }

    // Get all users to whom the collection is shared
    let sharedWith = collection.sharedWith.map((user) => {
        return {
            _id: user._id,
            username: user.username,
        };
    });

    // If no shared collections
    if (!sharedWith?.length) {
        return res.status(200).json({
            message: "Collection is not shared with anyone",
            success: false,
        });
    }

    res.json({ result: sharedWith, success: true });
});

module.exports = {
    getAllCollections,
    createNewCollection,
    updateCollection,
    deleteCollection,
    getCollectionSharedWith,
};
