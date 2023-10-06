const express = require("express");
const router = express.Router();
const collectionsController = require("../controllers/collectionsController");

router
    .route("/user/collections")
    .get(collectionsController.getAllCollections)
    .post(collectionsController.createNewCollection)
    .patch(collectionsController.updateCollection)
    .delete(collectionsController.deleteCollection);
router
    .route("/user/collection/sharedwith")
    .get(collectionsController.getCollectionSharedWith);

module.exports = router;
