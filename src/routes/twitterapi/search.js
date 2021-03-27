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
  "/analytica/twitter/search/status/:documentId",
  isLoggedIn,
  searchController.checkSearchStatus
);

router.get(
  "/analytica/twitter/search/download/:documentId",
  isLoggedIn,
  searchController.downloadSearchResults
);

module.exports = router;
