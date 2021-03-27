const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../middleware/isloggedin")

const trendsController = require('../../controllers/twitter/trends.controller');

router.get('/analytica/twitter/trends/worldwide', isLoggedIn, trendsController.worldwideTrends);

router.get('/analytica/twitter/trends/nearby', isLoggedIn, trendsController.nearbyTrends);

module.exports = router;