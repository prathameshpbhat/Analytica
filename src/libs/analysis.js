const computeTotals = (tweets) => {
  let total_likes = 0;
  let total_replies = 0;
  let total_retweets = 0;
  let total_quotes = 0;
  let total_impressions = 0;
  let total_url_link_clicks = 0;
  let total_engagement = 0;
  tweets.forEach((tweet) => {
    total_likes += tweet.public_metrics.like_count;
    total_replies += tweet.public_metrics.reply_count;
    total_retweets += tweet.public_metrics.retweet_count;
    total_quotes += tweet.public_metrics.quote_count;
    total_engagement += tweet.engagement;
    // if (tweet.non_public_metrics) {
    total_impressions += tweet.non_public_metrics.impression_count;
    if (tweet.non_public_metrics.url_link_clicks)
      total_url_link_clicks += tweet.non_public_metrics.url_link_clicks;
    // }
  });

  // if (tweets[0].non_public_metrics) {
  return {
    total_likes: total_likes,
    total_replies: total_replies,
    total_retweets: total_retweets,
    total_quotes: total_quotes,
    total_engagement: total_engagement,
    total_impressions: total_impressions,
    total_url_link_clicks: total_url_link_clicks,
  };
  // } else {
  //   return {
  //     total_likes: total_likes,
  //     total_replies: total_replies,
  //     total_retweets: total_retweets,
  //     total_quotes: total_quotes,
  //   };
  // }
};

const getTweetType = (user_tweets) => {
  let retweets = 0;
  let tweets = 0;
  let replies = 0;
  let quotes = 0;
  user_tweets.forEach((tweet) => {
    if (tweet.referenced_tweets) {
      let tweet_type = tweet.referenced_tweets[0].type;
      if (tweet_type == "replied_to") replies++;
      else if (tweet_type == "retweeted") retweets++;
      else if (tweet_type == "quoted") quotes++;
    } else tweets++;
  });
  return {
    retweets: retweets,
    tweets: tweets,
    replies: replies,
    quotes: quotes,
  };
};

module.exports = {
  computeTotals,
  getTweetType,
};
