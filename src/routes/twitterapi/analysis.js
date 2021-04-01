const express = require("express");
const router = express.Router();

const analysisController = require("../../controllers/analysis.controller");

const isAuth = require("../../middleware/auth");

router.get("/metrics", isAuth, analysisController.getMetrics);

router.get("/top_tweets", isAuth, analysisController.getTopTweets);

router.get("/30_day_period", isAuth, analysisController.get30DayPeriod);

module.exports = router;
