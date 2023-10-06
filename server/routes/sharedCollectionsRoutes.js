const express = require("express");
const router = express.Router();
const sharedCollectionsController = require("../controllers/sharedCollectionsController");

router
    .route("/user/collection/share")
    .get(sharedCollectionsController.getAllSharedCollections)
    .post(sharedCollectionsController.shareCollection)
    .delete(sharedCollectionsController.removeSharedCollection);

module.exports = router;
