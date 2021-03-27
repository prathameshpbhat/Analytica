const express = require("express");
const router = express.Router();
const isloggedin = require("../../../middleware/isloggedin");

const tweetsController = require("../../../controllers/twitter/user/tweets.controller");
const mediaUploadController = require("../../../controllers/twitter/user/media_upload.controller");
// All the api requests

// MAKE TWEET (Post status)
router.post(
  "/analytica/twitter/personal/update-status",
  isloggedin,
  tweetsController.makeTweet
);

router.post(
  "/analytica/twitter/personal/update-status-with-media",
  mediaUploadController.initialize
);

// REPLY TO A TWEET
router.post(
  "/analytica/twitter/personal/reply/:tweetid",
  isloggedin,
  tweetsController.replyToTweet
);

// DELETE TWEET
router.delete(
  "/analytica/twitter/personal/delete-status/:tweetid",
  isloggedin,
  tweetsController.deleteTweet
);

// RETWEET A TWEET
router.post(
  "/analytica/twitter/personal/retweet/:tweetid",
  isloggedin,
  tweetsController.retweet
);

// UNRETWEET A TWEET
router.post(
  "/analytica/twitter/personal/unretweet/:tweetid",
  isloggedin,
  tweetsController.unretweet
);

// LIKE TWEET
router.post(
  "/analytica/twitter/personal/favourite",
  isloggedin,
  tweetsController.likeTweet
);

// REMOVE LIKE FROM TWEET
router.post(
  "/analytica/twitter/personal/unfavourite",
  isloggedin,
  tweetsController.unlikeTweet
);

// GET RECENT LIKED TWEETS OF USER
router.get(
  "/analytica/twitter/personal/favourite-list",
  isloggedin,
  tweetsController.getLikeList
);

// GET ALL TWEETS OAUTH v1.0

// ACCEPT REQUEST AND WRITE RESPONSE TWEETS TO DATABASE
router.post(
  "/analytica/twitter/personal/tweets",
  isloggedin,
  tweetsController.requestUserTweets
);

// RETURN STATUS OF RESPONSE (POLLING)
router.get(
  "/analytica/twitter/personal/tweets/status",
  isloggedin,
  tweetsController.checkStatusOfUserTweets
);

// DOWNLOAD THE COMPLETE RESPONSE
router.get(
  "/analytica/twitter/personal/tweets/download",
  isloggedin,
  tweetsController.downloadUserTweets
);

// GET TWEETS MADE TODAY
router.get(
  "/analytica/twitter/personal/tweets/today",
  isloggedin,
  tweetsController.getTweetsMadeByUserToday
);

module.exports = router;
