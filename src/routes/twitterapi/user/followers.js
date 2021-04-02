const express = require("express");
const router = express.Router();
const isAuth = require("../../../middleware/auth");

const followersController = require("../../../controllers/twitter/user/followers.controller");

router.get(
  "/analytica/twitter/personal/followers",
  isAuth,
  followersController.getFollowers
);

module.exports = router;
