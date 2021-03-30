const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../middleware/isloggedin");

const mentionsController = require("../../../controllers/twitter/user/mentions.controller");

router.get(
  "/analytica/twitter/personal/:userid/mentions",
  isLoggedIn,
  mentionsController.getAllMentions
);

router.get(
  "/analytica/twitter/personal/:userid/mentions/today",
  isLoggedIn,
  mentionsController.getTodaysMentions
);

module.exports = router;
