const express = require("express");
const router = express.Router();
const sharedCollectionsController = require("../controllers/sharedCollectionsController");
const verifyToken = require("../middleware/authMiddleware");

router
    .route("/user/collections/share")
    .get(verifyToken, sharedCollectionsController.getAllSharedCollections);
router
    .route("/user/collections/share/users")
    .get(verifyToken, sharedCollectionsController.getCollectionSharedWith)
    .post(verifyToken, sharedCollectionsController.shareCollection)
    .delete(verifyToken, sharedCollectionsController.removeSharedCollection);

module.exports = router;
