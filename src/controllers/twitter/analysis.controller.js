const analysisLib = require("../../libs/analysis.js");

const User_Tweets = require("../../models/twitter/user_tweets");

const userLib = require("../../libs/twitter_user");

const oauth = require(`../../libs/oauthv1`);

const axios = require("axios");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const ISOtoRegular = (date) => {
  date = new Date(date);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return year + "-" + month + "-" + dt;
};

const get30DayPeriod = async (req, res) => {
  try {
    const tweets = await userLib.getNonPublicTweets("832616602352783362");
    if (!tweets) return res.status(404).send("user tweets not available");

    let today = new Date();
    let startDate = new Date(
      new Date(
        new Date(new Date().setDate(today.getDate() - 30)).setHours(0, 0, 0, 0)
      ).toISOString()
    );

    let endDate = today;
    let currentStartDate = startDate;
    let currentEndDate = new Date(currentStartDate.addDays(1));

    let days = {};

    while (currentStartDate < endDate) {
      let currentDateTweets = 0;
      let currentDateLikes = 0;
      let currentDateImpressions = 0;
      const currentStartDateNonISO = ISOtoRegular(currentStartDate);
      if (!(currentStartDateNonISO in days)) days[currentStartDateNonISO] = {};
      tweets.forEach((tweet) => {
        const tweet_created = new Date(tweet.created_at);
        if (
          tweet_created > currentStartDate &&
          tweet_created < currentEndDate
        ) {
          console.log("yes");
          console.log(currentStartDate);
          console.log("currentStartDate: " + currentStartDate);
          console.log("currentEndDate: " + currentEndDate);
          currentDateTweets++;
          currentDateLikes += tweet.public_metrics.like_count;
          currentDateImpressions += tweet.non_public_metrics.impression_count;
          days[currentStartDateNonISO][`tweet${currentDateTweets}`] = tweet;
        }
        days[currentStartDateNonISO]["total_tweet_count"] = currentDateTweets;
        days[currentStartDateNonISO]["total_like_count"] = currentDateLikes;
        days[currentStartDateNonISO][
          "total_impression_count"
        ] = currentDateImpressions;
      });
      currentStartDate = currentEndDate;
      currentEndDate = currentEndDate.addDays(1);
    }
    return res.status(200).json(days);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const getUser = async (userid) => {
  try {
    let count = 0;
    const api_endpoint = `https://api.twitter.com/1.1/users/lookup.json`;
    // const oauth_token = req.body.oauth_token;
    // const oauth_token_secret = req.body.oauth_token_secret;
    let params = {
      user_id: userid,
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
    const response = await axios.get(api_endpoint, config);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getTopTweets = async (req, res) => {
  try {
    const document = await User_Tweets.findOne({ Author: req.user._id });
    if (!document) return res.status(404).send("Document not found");
    let tweets = document.results;
    if (tweets.length == 0)
      return res.status(404).send("user tweets not available");
    const topTweets = tweets
      .sort(
        (tweet1, tweet2) =>
          tweet2.public_metrics.like_count +
          tweet2.public_metrics.retweet_count +
          tweet2.public_metrics.reply_count +
          tweet2.public_metrics.quote_count -
          (tweet1.public_metrics.like_count +
            tweet1.public_metrics.retweet_count +
            tweet1.public_metrics.reply_count +
            tweet1.public_metrics.quote_count)
      )
      .slice(0, 5);
    return res.status(200).send(topTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const getTopTweets30Days = async (req, res) => {
  try {
    const tweets = await userLib.getNonPublicTweets("832616602352783362");
    if (!tweets) return res.status(404).send("user tweets not available");
    let topTweets = [];
    topTweets = tweets
      .sort((tweet1, tweet2) => tweet2.engagement + tweet1.engagement)
      .slice(0, 5);

    return res.status(200).send(topTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const recent_tweets = (tweets, followers_count) => {
  let like_count = 0;
  let comment_count = 0;
  let engagement = 0;
  let postDates = [];
  let postLikes = [];
  let postComments = [];
  let i = 0;
  tweets.forEach((tweet) => {
    engagement +=
      ((tweet.public_metrics.like_count + tweet.public_metrics.reply_count) /
        followers_count) *
      100;
    like_count += tweet.public_metrics.like_count;
    comment_count += tweet.public_metrics.reply_count;
    i++;
    if (i <= 12) {
      const month = new Date(tweet.created_at)
        .toLocaleString("default", {
          month: "long",
        })
        .slice(0, 3);
      const day = new Date(tweet.created_at).getDate();
      postDates.unshift(`${day} ${month}`);
      postLikes.unshift(tweet.public_metrics.like_count);
      postComments.unshift(tweet.public_metrics.reply_count);
    }
  });
  return {
    postDates,
    postLikes,
    postComments,
    like_count,
    comment_count,
    engagement,
  };
};

const getAnalysis = async (req, res) => {
  try {
    const tweets = await userLib.getFewPublicTweets("15506669");

    if (!tweets) return res.status(404).send("User doesn't have any tweets");
    tweets.pop();
    const user = await getUser("15506669");
    let postFreq = 0;
    let freq = 0;
    for (let i = 0; i < tweets.length - 1; i++) {
      const day1 = new Date(tweets[i].created_at);
      const day2 = new Date(tweets[i + 1].created_at);
      freq += day1.getTime() - day2.getTime();
    }
    postFreq = 1 / (freq / 1000 / 60 / 60 / 24 / 3);

    let followers_count = 0;

    if (user) {
      followers_count = user[0].followers_count;
      posts_count = user[0].statuses_count;
    }

    const {
      postDates,
      postLikes,
      postComments,
      like_count,
      comment_count,
      engagement,
    } = recent_tweets(tweets, followers_count);

    const engagement_rate = (like_count + comment_count) / followers_count;

    const response = {
      postdates: postDates,
      postLikes: postLikes,
      postComments: postComments,
      postFrequency: postFreq.toFixed(3),
      followers: followers_count,
      likes: like_count,
      comments: comment_count,
      posts: posts_count,
      engagement: engagement_rate.toFixed(3),
    };
    return res.status(200).send(response);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).send(error);
    } else {
      console.log(error);
      return res.status(500).send();
    }
  }
};

// const getMetrics = async (req, res) => {
//   try {
//     const tweets = await userLib.getNonPublicTweets("15506669");

//     if (!tweets) return res.status(404).send("User doesn't have any tweets");

//     const user = await getUser("15506669");
//     let postFreq = 0;
//     for (let i = 0; i < tweets.length - 1; i++) {
//       const day1 = new Date(tweets[i].created_at);
//       const day2 = new Date(tweets[i + 1].created_at);
//       postFreq += day1.getTime() - day2.getTime();
//     }
//     postFreq = 1 / (postFreq / 1000 / 60 / 60 / 24 / 3);

//     let followers_count = 0;
//     let likes_count = 0;
//     let posts_count = 0;
//     if (user) {
//       followers_count = user[0].followers_count;
//       likes_count = user[0].favourites_count;
//       posts_count = user[0].statuses_count;
//     }

//     let click_through_rate30days = 0;
//     let engagement_rate30days = 0;
//     let tweet_count30days = 0;
//     let like_rate30days = 0;
//     let virality_rate30days = 0;

//     let non_public_tweets = [];

//     tweets.forEach((tweet) => {
//       if (tweet.non_public_metrics.url_link_clicks) {
//         click_through_rate30days += tweet.click_through_rate;
//       }
//       engagement_rate30days += tweet.engagement;
//       like_rate30days += tweet.like_rate;
//       virality_rate30days += tweet.virality_rate;
//       tweet_count30days++;
//     });

//     const { postDates, postLikes, postComments } = recent_tweets(tweets);

//     const averageEngagementRate30Days =
//       (engagement_rate30days / tweet_count30days) * 100;

//     const averageClickThroughRate30Days =
//       (click_through_rate30days / tweet_count30days) * 100;

//     const averageLikeRate30Days = (like_rate30days / tweet_count30days) * 100;

//     const averageViralityRate30Days =
//       (virality_rate30days / tweet_count30days) * 100;

//     const averagePostPerDay30Days = tweet_count30days / 30;

//     const totalsOverTime = analysisLib.computeTotals(tweets);

//     let response = {};

//     if (non_public_tweets.length > 0) {
//       const totals30Days = analysisLib.computeTotals(tweets);
//       response = {
//         postdates: postDates,
//         postLikes: postLikes,
//         postComments: postComments,
//         postFrequency: postFreq,
//         post_count_30days: tweets.length, //CHECK
//         average_post_per_day_30Days: averagePostPerDay30Days,
//         engagement: averageEngagementRate30Days,
//         average_clickthroughrate_30Days: averageClickThroughRate30Days,
//         average_likerate_30Days: averageLikeRate30Days,
//         average_viralityrate_30Days: averageViralityRate30Days,
//         total_likes_overtime: totalsOverTime.total_likes,
//         total_replies_overtime: totalsOverTime.total_replies,
//         total_retweets_overtime: totalsOverTime.total_retweets,
//         total_quotes_overtime: totalsOverTime.total_quotes,
//         followers: followers_count,
//         likes: likes_count,
//         posts: posts_count,
//         total_likes_30days: totals30Days.total_likes,
//         total_replies_30days: totals30Days.total_replies,
//         total_retweets_30days: totals30Days.total_retweets,
//         total_quotes_30days: totals30Days.total_quotes,
//         total_url_link_clicks_30days: totals30Days.total_url_link_clicks,
//         total_impressions_30days: totals30Days.total_impressions,
//         total_engagement_30days: totals30Days.total_engagement_30days,
//       };
//     } else {
//       response = {
//         post_frequency: postFreq,
//         total_likes_overtime: totalsOverTime.total_likes,
//         total_replies_overtime: totalsOverTime.total_replies,
//         total_retweets_overtime: totalsOverTime.total_retweets,
//         total_quotes_overtime: totalsOverTime.total_quotes,
//       };
//     }

//     return res.status(200).send(response);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).send(error);
//     } else {
//       console.log(error);
//       return res.status(500).send();
//     }
//   }
// };

module.exports = {
  getTopTweets30Days,
  get30DayPeriod,
  getTopTweets,
  // getMetrics,
  getAnalysis,
};
