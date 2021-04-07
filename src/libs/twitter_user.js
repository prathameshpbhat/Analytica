const oauth = require("./oauthv1");
const axios = require("axios");

const getUser = async (username) => {
  try {
    const api_endpoint = `https://api.twitter.com/2/users/by/username/${username}`;
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
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getFollowing = async (userid) => {
  try {
    let following = [];
    const api_endpoint = `https://api.twitter.com/2/users/${userid}/following`;

    let params = {
      max_results: 50,
      "tweet.fields":
        "author_id,in_reply_to_user_id,public_metrics,conversation_id,created_at,id",
      "user.fields":
        "created_at,location,profile_image_url,url,verified,public_metrics",
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

    const response = await axios.get(api_endpoint, config);
    following = following.concat(response.data.data);

    console.log(`Number of following: ${following.length}`);
    return Promise.resolve(following);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getNonPublicTweets = async (userid) => {
  try {
    let count = 0;
    let all_tweets = [];
    const api_endpoint = `https://api.twitter.com/2/users/${userid}/tweets`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      expansions: "in_reply_to_user_id,referenced_tweets.id",
      exclude: "retweets",
      max_results: "100",
      "tweet.fields":
        "non_public_metrics,public_metrics,created_at,conversation_id",
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
    let tweets = response.data.data;
    if (tweets) all_tweets = all_tweets.concat(tweets);
    let next_token = response.data.meta.next_token;
    while (next_token) {
      params.pagination_token = next_token;
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
      response = await axios.get(api_endpoint, config);
      tweets = response.data.data;
      if (tweets) all_tweets = all_tweets.concat(tweets);
      next_token = response.data.meta.next_token;
    }
    if (all_tweets) {
      all_tweets.forEach((tweet) => {
        count++;
        let impression_count = tweet.non_public_metrics.impression_count;
        if (!impression_count) impression_count = 1;
        tweet.engagement =
          tweet.public_metrics.like_count +
          tweet.public_metrics.reply_count +
          tweet.public_metrics.quote_count +
          tweet.public_metrics.retweet_count +
          tweet.non_public_metrics.user_profile_clicks;
        if (tweet.non_public_metrics.url_link_clicks) {
          tweet.engagement += tweet.non_public_metrics.url_link_clicks;
          tweet.click_through_rate =
            (tweet.non_public_metrics.url_link_clicks / impression_count) * 100;
        }
        tweet.engagement_rate = (tweet.engagement / impression_count) * 100;
        tweet.virality_rate =
          ((tweet.public_metrics.quote_count +
            tweet.public_metrics.retweet_count) /
            impression_count) *
          100;
        tweet.like_rate =
          (tweet.public_metrics.like_count / impression_count) * 100;
        // tweet.conversation_rate =
        //   (tweet.public_metrics.reply_count / impression_count) * 100;
      });
    }
    return Promise.resolve(all_tweets);
  } catch (error) {
    return Promise.reject(error);
  }
};

const get10PublicTweets = async (userid) => {
  try {
    let count = 0;
    const api_endpoint = `https://api.twitter.com/1.1/statuses/user_timeline.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      user_id: userid,
      count: 10,
      tweet_mode: "extended",
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
    let tweets = response.data;
    return Promise.resolve(tweets);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getPublicTweets = async (userid) => {
  try {
    let count = 0;
    const api_endpoint = `https://api.twitter.com/2/users/${userid}/tweets`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      expansions: "in_reply_to_user_id,referenced_tweets.id",
      exclude: "retweets",
      max_results: 100,
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
    let tweets = response.data.data;
    let all_tweets = tweets;
    let next_token = response.data.meta.next_token;
    while (next_token) {
      params.pagination_token = next_token;
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
      response = await axios.get(api_endpoint, config);
      tweets = response.data.data;
      all_tweets = all_tweets.concat(tweets);
      count = all_tweets.length;
      next_token = response.data.meta.next_token;
    }
    return Promise.resolve(all_tweets);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getPublicTweetsCommon = async (userid) => {
  try {
    let count = 0;
    const api_endpoint =
      "https://api.twitter.com/1.1/statuses/user_timeline.json";
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      user_id: userid,
      count: 100,
      tweet_mode: "extended",
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
    let tweets = response.data;
    let all_tweets = [];
    tweets.forEach((tweet) => {
      let ts = new Date(tweet.created_at).valueOf();
      all_tweets.unshift({
        timeStamp: ts,
        caption: tweet.full_text,
        likeCount: tweet.favorite_count,
        commentCount: tweet.retweet_count,
        sMedia: "twitter",
      });
    });
    return Promise.resolve(all_tweets);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeOlderTweets = (tweet, index, array) => {
  return tweet.created_at < array.oldest_date;
};

module.exports = {
  getUser,
  getFollowing,
  getNonPublicTweets,
  getPublicTweets,
  get10PublicTweets,
  removeOlderTweets,
  getPublicTweetsCommon,
};
