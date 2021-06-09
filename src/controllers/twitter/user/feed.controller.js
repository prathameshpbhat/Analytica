const oauth = require("../../../libs/oauthv1");
const axios = require("axios");

const userLib = require("../../../libs/twitter_user");

// const getfollowing = async (userid) => {
//   try {
//     let following = [];
//     const api_endpoint = `https://api.twitter.com/2/users/${userid}/following`;

//     let params = {
//       max_results: 100,
//       "tweet.fields":
//         "author_id,in_reply_to_user_id,public_metrics,conversation_id,created_at,id",
//       "user.fields":
//         "created_at,location,profile_image_url,url,verified,public_metrics",
//       expansions: "pinned_tweet_id",
//     };

//     let options = {
//       method: "GET",
//       url: api_endpoint,
//       params: params,
//     };

//     const config = {
//       params: params,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: oauth.generateAuthHeader(options),
//       },
//     };

//     const response = await axios.get(api_endpoint, config);
//     following = following.concat(response.data.data);
//     return Promise.resolve(following);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

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
    const following = await userLib.getFollowing("15506669");

    let feeds = [];

    const myTweets = await userLib.get10PublicTweets("15506669");

    feeds = feeds.concat(myTweets);

    const loop = new Promise((resolve, reject) => {
      let numberOfFollowing = 0;
      following.forEach(async (follow) => {
        const followingTweets = await userLib.get10PublicTweets(follow.id);
        feeds = feeds.concat(followingTweets);
        if (numberOfFollowing++ == following.length - 1) resolve();
      });
    });

    await loop;

    feeds
      .sort(function (x, y) {
        return new Date(x.created_at) - new Date(y.created_at);
      })
      .reverse();

    return res.status(200).json(feeds);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    }
    console.log(error);
  }
};

// const getFeed = async (req, res) => {
//   try {
//     const api_endpoint =
//       "https://api.twitter.com/1.1/statuses/home_timeline.json";

//     let params = {
//       count: 200,
//     };

//     let options = {
//       method: "GET",
//       url: api_endpoint,
//       params: params,
//     };

//     const config = {
//       params: params,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: oauth.generateAuthHeader(options),
//       },
//     };
//     const response = await axios.get(api_endpoint, config);
//     return res.status(200).send(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error);
//     }
//     console.log(error);
//   }
// };

module.exports = {
  getFeed,
};
