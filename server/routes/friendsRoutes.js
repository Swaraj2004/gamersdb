const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");
const verifyToken = require("../middleware/authMiddleware");

router
    .route("/user/friends")
    .get(verifyToken, friendsController.getAllFriends)
    .delete(verifyToken, friendsController.removeFriend);
router
    .route("/user/friends/requests")
    .get(verifyToken, friendsController.getRequests)
    .post(verifyToken, friendsController.sendRequest);
router
    .route("/user/friends/requests/accept")
    .post(verifyToken, friendsController.acceptRequest);
router
    .route("/user/friends/requests/reject")
    .delete(verifyToken, friendsController.rejectRequest);

module.exports = router;
