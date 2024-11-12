const express = require("express");
const router = express.Router();
const collectionsController = require("../controllers/collectionsController");
const verifyToken = require("../middleware/authMiddleware");

router
    .route("/user/collections")
    .get(verifyToken, collectionsController.getAllCollections)
    .post(verifyToken, collectionsController.createNewCollection)
    .patch(verifyToken, collectionsController.updateCollection)
    .delete(verifyToken, collectionsController.deleteCollection);

module.exports = router;
