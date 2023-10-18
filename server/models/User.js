const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: null,
    },
    collections: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Collection",
            },
        ],
        default: [],
    },
    sharedCollections: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Collection",
            },
        ],
        default: [],
    },
    friends: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
});

module.exports = mongoose.model("User", userSchema);
