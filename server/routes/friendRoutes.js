const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router.route("/user/friends/:uid").get(friendsController.getAllFriends);
router.route("/user/friend/requests/:uid").get(friendsController.getRequests);
router.route("/user/friend/add").post(friendsController.sendRequest);
router.route("/user/friend/accept").post(friendsController.acceptRequest);
router.route("/user/friend/reject").post(friendsController.rejectRequest);
router.route("/user/friend/remove").delete(friendsController.removeFriend);

module.exports = router;
