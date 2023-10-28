const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router.route("/user/friends").get(friendsController.getAllFriends);
router.route("/user/friends/add").post(friendsController.sendRequest);
router.route("/user/friends/requests").get(friendsController.getRequests);
router.route("/user/friends/accept").post(friendsController.acceptRequest);
router.route("/user/friends/reject").delete(friendsController.rejectRequest);
router.route("/user/friends/remove").delete(friendsController.removeFriend);

module.exports = router;
