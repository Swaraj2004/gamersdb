const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController");

router
    .route("/games/recent_and_upcoming")
    .get(gamesController.getAllRecentAndUpcommingGames);
router.route("/games/search").get(gamesController.searchGames);
router.route("/games/gamedata").get(gamesController.getGameData);

module.exports = router;
