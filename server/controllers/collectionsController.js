const User = require("../models/User");
const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");

// @desc Get all collections
// @route GET /user/collections
// @access Private
const getAllCollections = asyncHandler(async (req, res) => {
    const { owner } = req.body;

    // Get all collections from MongoDB
    const collections = await Collection.find({ owner }).lean().exec();

    // If no friends
    if (!collections?.length) {
        return res.status(400).json({ message: "No collections found" });
    }

    res.json(collections);
});

// @desc Create a collection
// @route POST /user/collections
// @access Private
const createNewCollection = asyncHandler(async (req, res) => {
    const { name, owner } = req.body;

    // Confirm data
    if (!name || !owner) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if owner exists
    const user = await User.findById(owner).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for duplicate collection name
    const duplicate = await Collection.findOne({ name })
        .where("owner")
        .equals(owner)
        .lean()
        .exec();
    if (duplicate) {
        return res
            .status(409)
            .json({ message: "Collection name already used" });
    }

    // Create and store new collection
    const collectionObject = { name, owner };
    const collection = await Collection.create(collectionObject);

    // Add collection id to user's collections array
    user.collections.push(collection);
    await user.save();

    res.json({
        message: `Collection with name ${collection.name} created`,
    });
});

// @desc Update a collection
// @route PATCH /user/collections
// @access Private
const updateCollection = asyncHandler(async (req, res) => {
    const { id, name, owner } = req.body;

    // Confirm data
    if (!id || !name || !owner) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if collection exists to update
    const collection = await Collection.findById(id).exec();
    if (!collection) {
        return res.status(400).json({ message: "Collection not found" });
    }

    // Check if owner exists
    const user = await User.findById(owner).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for duplicate collection name
    const duplicate = await Collection.findOne({ name })
        .where("owner")
        .equals(owner)
        .lean()
        .exec();

    // Allow updates to the original collection
    if (duplicate && duplicate?._id.toString() !== id) {
        return res
            .status(409)
            .json({ message: "Collection name already used" });
    }

    collection.name = name;

    const updatedCollection = await collection.save();

    res.json({ message: `Collection name ${updatedCollection.name} updated` });
});

// @desc Delete a collection
// @route DELETE /user/collections
// @access Private
const deleteCollection = asyncHandler(async (req, res) => {
    const { id, owner } = req.body;

    // Confirm data
    if (!id || !owner) {
        return res.status(400).json({ message: "Collection ID Required" });
    }

    // Check if collection exists to delete
    const collection = await Collection.findById(id).exec();
    if (!collection) {
        return res.status(400).json({ message: "Collection not found" });
    }

    // Check if owner exists
    const user = await User.findById(owner).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Remove collection
    user.collections = user.collections.filter(
        (userCollectionId) => userCollectionId.toString() !== id
    );
    await user.save();
    const result = await collection.deleteOne();

    res.json({
        message: `Collection ${result.name} with ID ${result._id} deleted`,
    });
});

module.exports = {
    getAllCollections,
    createNewCollection,
    updateCollection,
    deleteCollection,
};
