const analysisLib = require("../../libs/analysis.js");

const User_Tweets = require("../../models/twitter/user_tweets");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const get30DayPeriod = async (req, res) => {
  try {
    const document = await User_Tweets.findOne({ Author: req.user._id });
    if (!document) return res.status(404).send("Document not found");
    let tweets = document.results;
    if (!tweets) return res.status(404).send("user tweets not available");

    let today = new Date();
    let startDate = new Date(
      new Date(
        new Date(new Date().setDate(today.getDate() - 30)).setHours(0, 0, 0, 0)
      ).toISOString()
    );

    let endDate = new Date(today.addDays(1));
    let currentStartDate = startDate;
    let currentEndDate = new Date(currentStartDate.addDays(1));

    let days = {};

    while (currentStartDate < endDate) {
      let currentDateTweets = 0;
      let currentDateLikes = 0;
      let currentDateImpressions = 0;
      const currentStartDateNonISO = currentStartDate
        .toISOString()
        .substring(0, 10);
      if (!(currentStartDateNonISO in days)) days[currentStartDateNonISO] = {};
      tweets.forEach((tweet) => {
        const tweet_created = new Date(tweet.created_at);
        if (
          tweet_created > currentStartDate &&
          tweet_created < currentEndDate
        ) {
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

const getTopTweets = async (req, res) => {
  try {
    const document = await User_Tweets.findOne({ Author: req.user._id });
    if (!document) return res.status(404).send("Document not found");
    let tweets = document.results;
    if (!tweets) return res.status(404).send("user tweets not available");
    const topTweets = tweets
      .sort((tweet1, tweet2) => tweet2.engagement - tweet1.engagement)
      .slice(0, 5);
    return res.status(200).send(topTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const getMetrics = async (req, res) => {
  try {
    const document = await User_Tweets.findOne({ Author: req.user._id });
    if (!document) return res.status(404).send("Document not found");
    let tweets = document.results;
    if (!tweets) return res.status(404).send("user tweets not available");

    let postFreq = 0;
    for (let i = 0; i < tweets.length - 1; i++) {
      const day1 = new Date(tweets[i].created_at);
      const day2 = new Date(tweets[i + 1].created_at);
      postFreq += day1.getTime() - day2.getTime();
    }
    postFreq = 1 / (postFreq / 1000 / 60 / 60 / 24 / 3);

    let click_through_rate30days = 0;
    let engagement_rate30days = 0;
    let tweet_count30days = 0;
    let like_rate30days = 0;
    let virality_rate30days = 0;

    let non_public_tweets = [];

    tweets.forEach((tweet) => {
      if (tweet.non_public_metrics) {
        if (tweet.non_public_metrics.url_link_clicks) {
          click_through_rate30days += tweet.click_through_rate;
        }
        engagement_rate30days += tweet.engagement;
        like_rate30days += tweet.like_rate;
        virality_rate30days += tweet.virality_rate;
        tweet_count30days++;
        non_public_tweets.unshift(tweet);
      }
    });

    const averageEngagementRate30Days =
      (engagement_rate30days / tweet_count30days) * 100;

    const averageClickThroughRate30Days =
      (click_through_rate30days / tweet_count30days) * 100;

    const averageLikeRate30Days = (like_rate30days / tweet_count30days) * 100;

    const averageViralityRate30Days =
      (virality_rate30days / tweet_count30days) * 100;

    const averagePostPerDay30Days = tweet_count30days / 30;

    const totalsOverTime = analysisLib.computeTotals(tweets);

    let response = {};

    if (non_public_tweets) {
      const totals30Days = analysisLib.computeTotals(non_public_tweets);
      response = {
        post_frequency: postFreq,
        post_count_30days: non_public_tweets.length, //CHECK
        average_post_per_day_30Days: averagePostPerDay30Days,
        average_engagementrate_30days: averageEngagementRate30Days,
        average_clickthroughrate_30Days: averageClickThroughRate30Days,
        average_likerate_30Days: averageLikeRate30Days,
        average_viralityrate_30Days: averageViralityRate30Days,
        total_likes_overtime: totalsOverTime.total_likes,
        total_replies_overtime: totalsOverTime.total_replies,
        total_retweets_overtime: totalsOverTime.total_retweets,
        total_quotes_overtime: totalsOverTime.total_quotes,
        total_engagement_overtime: totalsOverTime.total_engagement,
        total_likes_30days: totals30Days.total_likes,
        total_replies_30days: totals30Days.total_replies,
        total_retweets_30days: totals30Days.total_retweets,
        total_quotes_30days: totals30Days.total_quotes,
        total_url_link_clicks_30days: totals30Days.total_url_link_clicks,
        total_impressions_30days: totals30Days.total_impressions,
        total_engagement_30days: totals30Days.total_engagement_30days,
      };
    } else {
      response = {
        post_frequency: postFreq,
        total_likes_overtime: totalsOverTime.total_likes,
        total_replies_overtime: totalsOverTime.total_replies,
        total_retweets_overtime: totalsOverTime.total_retweets,
        total_quotes_overtime: totalsOverTime.total_quotes,
        total_engagement_overtime: totalsOverTime.total_engagement,
      };
    }

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

module.exports = {
  get30DayPeriod,
  getTopTweets,
  getMetrics,
};
