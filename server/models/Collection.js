const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    sharedWith: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    games: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Game",
            },
        ],
        default: [],
    },
});

module.exports = mongoose.model("Collection", collectionSchema);
