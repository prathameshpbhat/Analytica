const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../middleware/auth");

const authController = require("../../../controllers/twitter/user/auth.controller");

router.get("/analytica/twitter/login/verify", authController.verifyLogin);

router.post("/analytica/twitter/login/callback", authController.loginCallback);

router.post("/analytica/twitter/login", authController.startLogin);

module.exports = router;
