const express = require("express");
const router = express.Router();

const analysisController = require("../../controllers/twitter/analysis.controller");

const isAuth = require("../../middleware/auth");

router.get(
  "/analytica/twitter/analysis",
  isAuth,
  analysisController.getMetrics
);

router.get(
  "/analytica/twitter/top_tweets",
  isAuth,
  analysisController.getTopTweets
);

router.get(
  "/analytica/twitter/top_tweets/recent",
  isAuth,
  analysisController.getTopTweets30Days
);

router.get(
  "/analytica/twitter/30_day_period",
  isAuth,
  analysisController.get30DayPeriod
);

module.exports = router;
