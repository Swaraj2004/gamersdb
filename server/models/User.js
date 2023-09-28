const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
    shared: {
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
