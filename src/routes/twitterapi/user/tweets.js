const express = require("express");
const router = express.Router();
const isAuth = require("../../../middleware/auth");

const tweetsController = require("../../../controllers/twitter/user/tweets.controller");
// const mediaUploadController = require("../../../controllers/twitter/user/media_upload.controller");
// All the api requests

// MAKE TWEET (Post status)
router.post(
  "/analytica/twitter/personal/update-status",
  isAuth,
  tweetsController.makeTweet
);

// router.post(
//   "/analytica/twitter/personal/update-status-with-media",
//   mediaUploadController.initialize
// );

// REPLY TO A TWEET
router.post(
  "/analytica/twitter/personal/reply/:tweetid",
  isAuth,
  tweetsController.replyToTweet
);

// DELETE TWEET
router.delete(
  "/analytica/twitter/personal/delete-status/:tweetid",
  isAuth,
  tweetsController.deleteTweet
);

// RETWEET A TWEET
router.post(
  "/analytica/twitter/personal/retweet/:tweetid",
  isAuth,
  tweetsController.retweet
);

// UNRETWEET A TWEET
router.post(
  "/analytica/twitter/personal/unretweet/:tweetid",
  isAuth,
  tweetsController.unretweet
);

// LIKE TWEET
router.post(
  "/analytica/twitter/personal/favourite",
  isAuth,
  tweetsController.likeTweet
);

// REMOVE LIKE FROM TWEET
router.post(
  "/analytica/twitter/personal/unfavourite",
  isAuth,
  tweetsController.unlikeTweet
);

// GET RECENT LIKED TWEETS OF USER
router.get(
  "/analytica/twitter/personal/favourite-list",
  isAuth,
  tweetsController.getLikeList
);

// GET ALL TWEETS OAUTH v1.0

// ACCEPT REQUEST AND WRITE RESPONSE TWEETS TO DATABASE
router.post(
  "/analytica/twitter/personal/tweets",
  isAuth,
  tweetsController.requestUserTweets
);

// RETURN STATUS OF RESPONSE (POLLING)
router.get(
  "/analytica/twitter/personal/tweets/status/:documentId",
  isAuth,
  tweetsController.checkStatusOfUserTweets
);

// DOWNLOAD THE COMPLETE RESPONSE
router.get(
  "/analytica/twitter/personal/tweets/download/:documentId",
  isAuth,
  tweetsController.downloadUserTweets
);

// GET TWEETS MADE TODAY
// router.get(
//   "/analytica/twitter/personal/tweets/today",
//   isAuth,
//   tweetsController.getTweetsMadeByUserToday
// );

module.exports = router;
