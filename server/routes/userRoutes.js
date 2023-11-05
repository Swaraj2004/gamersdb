const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router
    .route("/user")
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);
router.route("/user/login").post(usersController.getUser);
router.route("/user/password").patch(usersController.updatePassword);

module.exports = router;
