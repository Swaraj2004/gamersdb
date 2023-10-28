const express = require("express");
const router = express.Router();
const dbgamesController = require("../controllers/dbgamesController");

router.route("/user/collections/games").get(dbgamesController.getAllGames);
router.route("/user/collections/games/add").post(dbgamesController.addGame);
router
    .route("/user/collections/games/remove")
    .delete(dbgamesController.removeGame);

module.exports = router;
