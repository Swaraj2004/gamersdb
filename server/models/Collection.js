const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
