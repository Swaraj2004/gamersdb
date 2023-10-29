const express = require("express");
const router = express.Router();
const dbgamesController = require("../controllers/dbgamesController");

router
    .route("/user/collections/games")
    .get(dbgamesController.getAllGames)
    .post(dbgamesController.addGame)
    .delete(dbgamesController.removeGame);

module.exports = router;
