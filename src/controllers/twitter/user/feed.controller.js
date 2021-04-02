const oauth = require("../../../libs/oauthv1");
const axios = require("axios");

const getfollowing = async (userid) => {
  try {
    let following = [];
    let next_token = "";
    let requestCount = 1;
    const api_endpoint = `https://api.twitter.com/2/users/${userid}/following`;

    let params = {
      max_results: 1000,
      "tweet.fields":
        "author_id,in_reply_to_user_id,public_metrics,conversation_id,created_at,id",
      "user.fields":
        "created_at,location,profile_image_url,url,verified,public_metrics",
      expansions: pinned_tweet_id,
    };

    let options = {
      method: "GET",
      url: api_endpoint,
      params: params,
    };

    const config = {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };

    console.log(`Request: ${requestCount}`);
    requestCount++;

    const response = await axios.get(api_endpoint, config);
    following = following.concat(response.data.data);
    next_token = response.data.meta.next_token;

    while (next_token) {
      params.pagination_token = next_token;
      options.params = params;
      const config = {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: oauth.generateAuthHeader(options),
        },
      };
      console.log(`Request: ${requestCount}`);
      requestCount++;
      const response = await axios.get(api_endpoint, config);
      following = following.concat(response.data.data);
      next_token = response.data.meta.next_token;
      if (requestCount > 2) break;
    }
    console.log(`Number of following: ${following.length}`);
    return Promise.resolve(following);
  } catch (error) {
    return Promise.reject(error);
  }
};

Array.prototype.shuffle = function () {
  let input = this;

  for (let i = input.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
};

const getFeed = async (req, res) => {
  try {
    const following = await getfollowing(req.user.twitter.user_details.id_str);
    // following.shuffle();
    // following.forEach((follower) => {});
    return res.status(200).json(following);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    }
    console.log(error);
  }
};

module.exports = {
  getFeed,
};
