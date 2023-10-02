const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router.get("/user/search", friendsController.searchFriend);
router
    .route("/user/friends")
    .get(friendsController.getAllFriends)
    .post(friendsController.addFriend)
    .delete(friendsController.removeFriend);

module.exports = router;
