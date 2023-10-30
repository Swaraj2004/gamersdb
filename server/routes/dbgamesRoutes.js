const express = require("express");
const router = express.Router();
const dbgamesController = require("../controllers/dbgamesController");

router
    .route("/user/collection")
    .get(dbgamesController.getCollection)
    .post(dbgamesController.addGame)
    .delete(dbgamesController.removeGame);
router.get("/user/collection/share", dbgamesController.getCollection);

module.exports = router;
