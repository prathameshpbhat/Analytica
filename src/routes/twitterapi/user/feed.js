const express = require("express");
const router = express.Router();
const isAuth = require("../../../middleware/auth");

const feedController = require("../../../controllers/twitter/user/feed.controller");

router.get("/analytica/twitter/personal/feed", isAuth, feedController.getFeed);

module.exports = router;
