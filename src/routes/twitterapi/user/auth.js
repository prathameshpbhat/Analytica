const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../middleware/auth");

const authController = require("../../../controllers/twitter/user/auth.controller");

router.get(
  "/analytica/twitter/login/verify",
  isLoggedIn,
  authController.verifyLogin
);

router.post(
  "/analytica/twitter/login/callback",
  isLoggedIn,
  authController.loginCallback
);

router.post("/analytica/twitter/login", isLoggedIn, authController.startLogin);

module.exports = router;
