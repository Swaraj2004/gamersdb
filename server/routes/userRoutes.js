const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router.route("/user/login").post(usersController.getUser);
router
    .route("/user")
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);

module.exports = router;
