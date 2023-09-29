const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router.get("/user/friends", friendsController.getAllFriends);
router.get("/user/search", friendsController.searchFriend);
router.patch("/user/addfriend", friendsController.addFriend);
router.patch("/user/removefriend", friendsController.removeFriend);

module.exports = router;
