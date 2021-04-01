const express = require("express");
const router = express.Router();
const isAuth = require("../../middleware/auth");

const trendsController = require("../../controllers/twitter/trends.controller");

router.get(
  "/analytica/twitter/trends/worldwide",
  isAuth,
  trendsController.worldwideTrends
);

router.get(
  "/analytica/twitter/trends/nearby",
  isAuth,
  trendsController.nearbyTrends
);

module.exports = router;
