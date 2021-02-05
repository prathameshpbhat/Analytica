const express = require('express');
const router = express.Router();
const axios = require('axios');

const config = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    }
}

router.get('/analytica/tweet/personal/:username/engagement/today', async (req, res) => {
    let userid = await axios.get(`https://api.twitter.com/2/users/by/username/${req.params.username}`, config);
    userid = userid.data.data.id;

    let count = 0;
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    d = d.toISOString()

    let api_endpoint = `https://api.twitter.com/2/users/${userid}/tweets?exclude=retweets&max_results=100&media.fields=public_metrics&tweet.fields=public_metrics,created_at&start_time=${d}`;
    let response = await axios.get(api_endpoint, config);
    let tweets = response.data.data;
    let all_tweets = tweets;
    let next_token = response.data.meta.next_token;
    while (next_token) {
        response = await axios.get(`${api_endpoint}&pagination_token=${next_token}`, config)
        tweets = response.data.data;
        all_tweets = all_tweets.concat(tweets);
        next_token = response.data.meta.next_token;
    }
    for (tweet in all_tweets) {
        count++;
    }
    console.log(count)
    return res.status(200).json({
        all_tweets
    })
});

module.exports = router;