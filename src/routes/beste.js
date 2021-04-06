const express = require("express");
const route = express.Router();
const usertweets = require("../libs/twitter_user");

route.get("/beste", async (req, res) => {
  try {
    const tweets = await usertweets.getPublicTweetsCommon(15506669);
    return res.status(200).send(tweets);
  } catch (error) {
    if (error.response) return res.status(error.response.status).send(error);
    else {
      console.log(error);
      return res.status(500).send();
    }
  }
});

module.exports = route;
