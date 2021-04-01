const express = require("express");
const router = express.Router();
const isAuth = require("../../../middleware/auth");

const authController = require("../../../controllers/twitter/user/auth.controller");

router.get(
  "/analytica/twitter/login/verify",
  isAuth,
  authController.verifyLogin
);

router.post(
  "/analytica/twitter/login/callback",
  isAuth,
  authController.loginCallback
);

router.post("/analytica/twitter/login", isAuth, authController.startLogin);

module.exports = router;
