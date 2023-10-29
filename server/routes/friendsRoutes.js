const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router
    .route("/user/friends")
    .get(friendsController.getAllFriends)
    .delete(friendsController.removeFriend);
router
    .route("/user/friends/requests")
    .post(friendsController.sendRequest)
    .get(friendsController.getRequests);
router
    .route("/user/friends/requests/accept")
    .post(friendsController.acceptRequest);
router
    .route("/user/friends/requests/reject")
    .delete(friendsController.rejectRequest);

module.exports = router;
