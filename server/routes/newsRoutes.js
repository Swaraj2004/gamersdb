const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

router.route("/news").get(newsController.getNews);

module.exports = router;
