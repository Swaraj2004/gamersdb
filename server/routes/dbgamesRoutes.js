const express = require("express");
const router = express.Router();
const dbgamesController = require("../controllers/dbgamesController");
const verifyToken = require("../middleware/authMiddleware");

router
    .route("/user/collection")
    .get(verifyToken, dbgamesController.getCollection)
    .post(verifyToken, dbgamesController.addGame)
    .delete(verifyToken, dbgamesController.removeGame);
router
    .route("/user/collection/share")
    .get(verifyToken, dbgamesController.getCollection);

module.exports = router;
