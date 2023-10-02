const User = require("../models/User");
const Collection = require("../models/Collection");
const Game = require("../models/Game");
const asyncHandler = require("express-async-handler");

async function validator(userId, collectionId) {
    // Check if user exists
    const user = await User.findById(userId).lean().exec();
    if (!user) {
        return { error: { message: "User not found" } };
    }

    // Check if collection exists
    const collection = await Collection.findById(collectionId).exec();
    if (!collection) {
        return { error: { message: "Collection not found" } };
    }

    // Check if user is the owner of the collection
    if (userId !== collection.owner.toString()) {
        return {
            error: { message: "User is not the owner of the collection" },
        };
    }

    return { user, collection };
}

// @desc Get all games
// @route GET /user/collection/games
// @access Private
const getAllGames = asyncHandler(async (req, res) => {
    const { userId, collectionId } = req.body;

    // Confirm data
    if (!userId || !collectionId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const validation = await validator(userId, collectionId);

    if (validation.error) {
        return res.status(404).json(validation.error);
    }

    const collection = await Collection.findById(collectionId)
        .populate("games")
        .exec();

    // Get all games from games array
    const games = collection.games;

    // If no games
    if (!games?.length) {
        return res.status(200).json({ message: "No games are added" });
    }

    res.json(games);
});

// @desc Add the game
// @route POST /user/collection/games
// @access Private
const addGame = asyncHandler(async (req, res) => {
    const { userId, collectionId, name, slug, genre, coverUrl } = req.body;

    // Confirm data
    if (!userId || !collectionId || !name || !slug || !genre) {
        return res.status(400).json({ message: "All fields are required" });
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
        if (!collection.games.includes(duplicate._id)) {
            collection.games.push(duplicate);
            await collection.save();
        } else {
            return res
                .status(400)
                .json({ message: "Game already exists in the collection" });
        }

        res.json({
            message: `New game ${duplicate.name} added`,
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
        message: `New game ${game.name} added`,
    });
});

// @desc Remove the game
// @route DELETE /user/collection/games
// @access Private
const removeGame = asyncHandler(async (req, res) => {
    const { userId, collectionId, slug } = req.body;

    // Confirm data
    if (!userId || !collectionId || !slug) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const validation = await validator(userId, collectionId);

    if (validation.error) {
        return res.status(404).json(validation.error);
    }

    const collection = validation.collection;

    const game = await Game.findOne({ slug }).exec();
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    const gameId = game._id;
    // Check if game is not added
    if (!collection.games.includes(gameId)) {
        return res.status(400).json({ message: "Game not added" });
    }

    // Remove game
    collection.games = collection.games.filter(
        (collectionGameId) => collectionGameId.toString() !== gameId.toString()
    );
    await collection.save();

    res.json({
        message: `Game ${game.name} removed`,
    });
});

module.exports = {
    getAllGames,
    addGame,
    removeGame,
};
