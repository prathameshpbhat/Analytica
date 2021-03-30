const axios = require("axios");
const oauth = require("../../../helpers/oauthv1");

const UserTweets = require("../../../models/twitter/user_tweets");

const User = require("../../../models/users");

const makeTweet = async (req, res) => {
  try {
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const api_endpoint = `https://api.twitter.com/1.1/statuses/update.json`;
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        status: req.body.status,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const params = new URLSearchParams();
    params.append("status", req.body.status);
    const response = await axios.post(api_endpoint, params, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(500).json(error.toString());
    }
  }
};

const replyToTweet = async (req, res) => {
  try {
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const tweetid = req.params.tweetid;
    const getUsernameOptions = {
      method: "GET",
      url: "https://api.twitter.com/1.1/statuses/show.json",
      params: {
        id: tweetid,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const userResponse = await axios.get(
      `https://api.twitter.com/1.1/statuses/show.json?id=${tweetid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: oauth.generateAuthHeader(getUsernameOptions),
        },
      }
    );
    const username = userResponse.data.user.screen_name;

    const postReplyOptions = {
      method: "POST",
      url: "https://api.twitter.com/1.1/statuses/update.json",
      params: {
        status: `@${username} ${req.body.status}`,
        in_reply_to_status_id: tweetid,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(postReplyOptions),
      },
    };
    const params = new URLSearchParams();
    params.append("status", `@${username} ${req.body.status}`);
    params.append("in_reply_to_status_id", tweetid);
    const response = await axios.post(
      "https://api.twitter.com/1.1/statuses/update.json",
      params,
      headers
    );
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(500).json(error.toString());
    }
  }
};

const deleteTweet = async (req, res) => {
  try {
    const api_endpoint = `https://api.twitter.com/1.1/statuses/destroy/${req.params.tweetid}.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const options = {
      method: "POST",
      url: api_endpoint,
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.post(api_endpoint, {}, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const retweet = async (req, res) => {
  try {
    const api_endpoint = `https://api.twitter.com/1.1/statuses/retweet/${req.params.tweetid}.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const options = {
      method: "POST",
      url: api_endpoint,
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.post(api_endpoint, {}, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const unretweet = async (req, res) => {
  try {
    const api_endpoint = `https://api.twitter.com/1.1/statuses/unretweet/${req.params.tweetid}.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const options = {
      method: "POST",
      url: api_endpoint,
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    let response = await axios.post(api_endpoint, {}, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const likeTweet = async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: "user not authorised",
    });
  }

  try {
    const api_endpoint = `https://api.twitter.com/1.1/favorites/create.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        id: req.body.tweetid,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const params = new URLSearchParams();
    params.append("id", req.body.tweetid);
    let response = await axios.post(api_endpoint, params, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const unlikeTweet = async (req, res) => {
  try {
    const api_endpoint = `https://api.twitter.com/1.1/favorites/destroy.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        id: req.body.tweetid,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const params = new URLSearchParams();
    params.append("id", req.body.tweetid);
    const response = await axios.post(api_endpoint, params, headers);
    return res.status(res.statusCode).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const getLikeList = async (req, res) => {
  try {
    let count = 0;
    const api_endpoint = `https://api.twitter.com/1.1/favorites/list.json`;
    const api_parameters = `?count=200`;
    // const oauth_token = req.query.oauth_token;
    // const oauth_token_secret = req.query.oauth_token_secret;
    const options = {
      method: "GET",
      url: api_endpoint,
      params: {
        count: "200",
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const response = await axios.get(`${api_endpoint}${api_parameters}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    });
    const tweets = response.data;

    for (tweet in tweets) {
      count++;
    }
    return res.status(res.statusCode).json({
      tweets,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

const requestUserTweets = async (req, res) => {
  try {
    let documentId = "";
    const user_tweets = await UserTweets.findOne({ Author: req.user._id });
    if (user_tweets) {
      documentId = user_tweets._id;
    } else {
      let user_tweets = new UserTweets({
        status: 0,
        Author: req.user._id,
        results: [],
        count: 0,
      });
      const newUserTweets = await UserTweets.create(user_tweets);
      await User.updateOne(
        {
          _id: req.user._id,
        },
        {
          $push: {
            "twitter.user_tweets": documentId,
          },
        }
      );
      documentId = newUserTweets._id;
    }

    res.status(202).json({
      status: "The request has been accepted. Please wait",
      documentId: documentId,
    });

    let count = 0;
    const api_endpoint = `https://api.twitter.com/2/users/${req.user.twitter.user_id}/tweets`;
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
      next_token = response.data.meta.next_token;
    }

    all_tweets.forEach((tweet) => {
      count++;
      tweet.engagement =
        tweet.public_metrics.like_count +
        tweet.public_metrics.reply_count +
        tweet.public_metrics.quote_count +
        tweet.public_metrics.retweet_count;
      tweet.engagement_rate =
        tweet.engagement / req.user.twitter.follower_count;
      tweet.amplification_rate =
        (tweet.public_metrics.quote_count +
          tweet.public_metrics.retweet_count) /
        req.user.twitter.follower_count;
      tweet.applause_rate =
        tweet.public_metrics.like_count / req.user.twitter.follower_count;
      tweet.conversation_rate =
        tweet.public_metrics.reply_count / req.user.twitter.follower_count;
    });

    const updateUserTweets = {
      status: 1,
      results: all_tweets,
      count: count,
    };

    await UserTweets.updateOne({ _id: documentId }, updateUserTweets);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        error: error.toString(),
      });
    }
  }
};

const checkStatusOfUserTweets = async (req, res) => {
  await user_tweets
    .findById(req.params.documentId)
    .then((user) => {
      if (user) {
        if (search.status == 0) {
          return res.status(204).send();
        } else if (search.status == 1) {
          return res.status(200).json({
            status: 1,
            Result: search.results,
          });
        }
      } else {
        return res.status(404).json({
          error: "Search not made",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

const downloadUserTweets = (req, res) => {
  user_tweets
    .findById(req.params.documentId)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          Result: user.results,
        });
      } else {
        return res.status(404).json({
          error: "User's tweets not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

const getTweetsMadeByUserToday = async (req, res) => {
  try {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    d = d.toISOString();

    let count = 0;
    const api_endpoint = `https://api.twitter.com/2/users/${req.body.userid}/tweets`;
    const api_parameters = `?exclude=retweets&start_time=${d}&max_results=100&tweet.fields=public_metrics,created_at`;
    // const options = {
    //     method: 'GET',
    //     url: api_endpoint,
    //     params: {
    //         'exclude': 'retweets',
    //         'start_time': d,
    //         'max_results': '100',
    //         'tweet.fields': 'public_metrics,created_at'
    //     }
    // }
    let response = await axios.get(`${api_endpoint}${api_parameters}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        // Authorization: oauth.generateAuthHeader(options)
      },
    });
    let tweets = response.data.data;
    let all_tweets = tweets;
    let next_token = response.data.meta.next_token;
    while (next_token) {
      response = await axios.get(
        `${api_endpoint}${api_parameters}&pagination_token=${next_token}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            // Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
            //     'exclude': 'retweets',
            //     'start_time': d,
            //     'max_results': '100',
            //     'tweet.fields': 'public_metrics,created_at',
            //     'pagination_token': next_token
            // })
          },
        }
      );
      tweets = response.data.data;
      all_tweets = all_tweets.concat(tweets);
      next_token = response.data.meta.next_token;
    }
    for (tweet in all_tweets) {
      count++;
    }
    return res.status(res.statusCode).json({
      all_tweets,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      return res.status(400).json(error.toString());
    }
  }
};

module.exports = {
  makeTweet,
  replyToTweet,
  deleteTweet,
  retweet,
  unretweet,
  likeTweet,
  unlikeTweet,
  getLikeList,
  requestUserTweets,
  checkStatusOfUserTweets,
  downloadUserTweets,
  getTweetsMadeByUserToday,
};