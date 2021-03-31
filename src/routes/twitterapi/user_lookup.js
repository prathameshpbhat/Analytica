const express = require("express");
const router = express.Router();
const isAuth = require("../../middleware/auth");

router.get(
  "/analytica/twitter/user/by/:username",
  isAuth,
  (req, res) => {
    const api_endpoint = `https://api.twitter.com/2/users/by/username/${req.params.}`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      expansions: "in_reply_to_user_id,referenced_tweets.id",
      max_results: "100",
      "tweet.fields": "public_metrics,created_at,conversation_id",
    };
    const options = {
      method: "GET",
      url: api_endpoint,
      params: params,
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const config = {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    let response = await axios.get(api_endpoint, config);
  }
);

module.exports = router;
