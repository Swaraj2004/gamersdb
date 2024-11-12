const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// Public routes
router.route("/user").post(usersController.createNewUser);
router.route("/user/login").post(usersController.getUser);
router.route("/user/refresh-token").post(usersController.refreshToken);
router.route("/user/logout").post(usersController.logout);

// Private routes - requires JWT access token
router.route("/user").patch(verifyToken, usersController.updateUser);
router
    .route("/user/password")
    .patch(verifyToken, usersController.updatePassword);
router.route("/user/:userId").delete(verifyToken, usersController.deleteUser);

module.exports = router;
