const User = require("../models/User");
const Collection = require("../models/Collection");
const Game = require("../models/Game");
const asyncHandler = require("express-async-handler");

async function validator(userId, collectionId, shared = false) {
    // Check if user exists
    const user = await User.findById(userId).lean().exec();
    if (!user) {
        return { error: { message: "User not found", success: false } };
    }

    // Check if collection exists
    const collection = await Collection.findById(collectionId).exec();
    if (!collection) {
        return { error: { message: "Collection not found", success: false } };
    }

    // Check if user is the owner of the collection
    if (!shared && userId !== collection.owner.toString()) {
        return {
            error: {
                message: "User is not the owner of the collection",
                success: false,
            },
        };
    }

    // Check if collection is shared
    if (shared && !collection.sharedWith.includes(userId)) {
        return { error: { message: "Collection not shared", success: false } };
    }

    return { user, collection };
}

const collectionGetter = async (req, res, shared) => {
    const { uid: userId, collid: collectionId } = req.query;

    // Confirm data
    if (!userId || !collectionId) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    const validation = await validator(userId, collectionId, shared);

    if (validation.error) {
        return res.status(404).json(validation.error);
    }

    const collection = await Collection.findById(collectionId)
        .populate("games")
        .exec();

    // Get all games from games array
    const games = collection.games;

    res.json({ result: { collection: collection.name, games }, success: true });
};

// @desc Get a collection (shared or non-shared)
// @route GET /user/collection
// @route GET /user/collection/share
// @access Private
const getCollection = asyncHandler(async (req, res) => {
    // Determine whether the collection is shared based on the route
    const shared = req.path === "/user/collection/share";
    collectionGetter(req, res, shared);
});

// @desc Add the game
// @route POST /user/collection
// @access Private
const addGame = asyncHandler(async (req, res) => {
    const {
        uid: userId,
        collid: collectionId,
        name,
        slug,
        genre,
        coverUrl,
    } = req.body;

    // Confirm data
    if (!userId || !collectionId || !name || !slug || !genre) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    const validation = await validator(userId, collectionId);

    if (validation.error) {
        return res.status(404).json(validation.error);
    }

    const collection = validation.collection;

    // Check if game already exists in games database collection
    // If exists then add existng game id to collection.games
    // If not then create and add id to collection.games
    const duplicate = await Game.findOne({ slug }).lean().exec();
    if (duplicate) {
        // Check if game is already in the collection
        const isInArr = collection.games.some(function (gameInArr) {
            return gameInArr.equals(duplicate._id);
        });
        if (!isInArr) {
            collection.games.push(duplicate);
            await collection.save();
        } else {
            return res.status(400).json({
                message: "Game already exists in the collection",
                success: false,
            });
        }

        res.json({
            message: `Game added to ${collection.name} successfully`,
            success: true,
        });
    }

    let gameObject = {};
    if (coverUrl) {
        gameObject = { name, slug, genre, coverUrl };
    } else {
        gameObject = { name, slug, genre };
    }
    const game = await Game.create(gameObject);
    collection.games.push(game);
    await collection.save();

    res.json({
        message: `Game added to ${collection.name} successfully`,
        success: true,
    });
});

// @desc Remove the game
// @route DELETE /user/collection
// @access Private
const removeGame = asyncHandler(async (req, res) => {
    const { uid: userId, collid: collectionId, slug } = req.query;

    // Confirm data
    if (!userId || !collectionId || !slug) {
        return res
            .status(400)
            .json({ message: "All fields are required", success: false });
    }

    const validation = await validator(userId, collectionId);

    if (validation.error) {
        return res.status(404).json(validation.error);
    }

    const collection = validation.collection;

    const game = await Game.findOne({ slug }).exec();
    if (!game) {
        return res
            .status(404)
            .json({ message: "Game not found", success: false });
    }

    const gameId = game._id;
    // Check if game is not added
    if (!collection.games.includes(gameId)) {
        return res
            .status(400)
            .json({ message: "Game not added", success: false });
    }

    // Remove game
    collection.games = collection.games.filter(
        (collectionGameId) => collectionGameId.toString() !== gameId.toString()
    );
    await collection.save();

    res.json({
        message: `Game removed successfully`,
        success: true,
    });
});

module.exports = {
    getCollection,
    addGame,
    removeGame,
};
