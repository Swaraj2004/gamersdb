const express = require("express");
const router = express.Router();
const dbgamesController = require("../controllers/dbgamesController");

router.route("/user/collection/games").post(dbgamesController.getAllGames);
router.route("/user/collection/addgame").post(dbgamesController.addGame);
router
    .route("/user/collection/removegame")
    .delete(dbgamesController.removeGame);

module.exports = router;
