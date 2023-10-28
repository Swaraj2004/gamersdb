const express = require("express");
const router = express.Router();
const sharedCollectionsController = require("../controllers/sharedCollectionsController");

router
    .route("/user/collections/shared")
    .get(sharedCollectionsController.getAllSharedCollections);
router
    .route("/user/collections/share")
    .get(sharedCollectionsController.getCollectionSharedWith)
    .post(sharedCollectionsController.shareCollection)
    .delete(sharedCollectionsController.removeSharedCollection);

module.exports = router;
