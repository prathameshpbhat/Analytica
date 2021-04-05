const express = require("express");
const router = express.Router();
const isAuth = require("../../middleware/auth");

const searchController = require("../../controllers/twitter/search.controller");

router.post("/analytica/twitter/search", isAuth, searchController.startSearch);

router.get(
  "/analytica/twitter/search/status/:documentId",
  isAuth,
  searchController.checkSearchStatus
);

router.get(
  "/analytica/twitter/search/download/:documentId",
  isAuth,
  searchController.downloadSearchResults
);

router.get(
  "/analytica/twitter/search/all/download",
  isAuth,
  searchController.downloadAllSearchResults
);

module.exports = router;
