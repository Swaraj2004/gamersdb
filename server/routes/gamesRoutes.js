const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController");

router
    .route("/games/recent_and_upcoming/:limit")
    .get(gamesController.getAllRecentAndUpcommingGames);
router.route("/games/search").get(gamesController.searchGames);
router.route("/games/gamedata/:slug").get(gamesController.getGameData);

module.exports = router;
