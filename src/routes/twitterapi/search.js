const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../middleware/isloggedin");

const searchController = require("../../controllers/twitter/search.controller");

router.post(
  "/analytica/twitter/search",
  isLoggedIn,
  searchController.startSearch
);

router.get(
  "/analytica/twitter/search/status",
  isLoggedIn,
  searchController.checkSearchStatus
);

router.get(
  "/analytica/twitter/search/download",
  isLoggedIn,
  searchController.downloadSearchResults
);

module.exports = router;
