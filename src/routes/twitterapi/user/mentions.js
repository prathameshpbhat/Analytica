const express = require("express");
const router = express.Router();
const isAuth = require("../../../middleware/auth");

const mentionsController = require("../../../controllers/twitter/user/mentions.controller");

router.get(
  "/analytica/twitter/personal/:userid/mentions",
  isAuth,
  mentionsController.getAllMentions
);

router.get(
  "/analytica/twitter/personal/:userid/mentions/today",
  isAuth,
  mentionsController.getTodaysMentions
);

module.exports = router;
