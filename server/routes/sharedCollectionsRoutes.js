const express = require("express");
const router = express.Router();
const sharedCollectionsController = require("../controllers/sharedCollectionsController");

router
    .route("/user/collection/share/:uid")
    .get(sharedCollectionsController.getAllSharedCollections);
router
    .route("/user/collection/share")
    .post(sharedCollectionsController.shareCollection)
    .delete(sharedCollectionsController.removeSharedCollection);

module.exports = router;
