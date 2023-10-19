const express = require("express");
const router = express.Router();
const collectionsController = require("../controllers/collectionsController");

router
    .route("/user/collections/:uid")
    .get(collectionsController.getAllCollections);
router
    .route("/user/collections")
    .post(collectionsController.createNewCollection)
    .patch(collectionsController.updateCollection)
    .delete(collectionsController.deleteCollection);
router
    .route("/user/collection/sharedwith")
    .post(collectionsController.getCollectionSharedWith);

module.exports = router;
