const express = require('express');
const router = express.Router();
const axios = require("axios");

const config = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    }
}

// router.get('/analytica/tweet/search/:variable', (req, res) => {
//     const spawn = require("child_process").spawn;
//     const pythonProcess = spawn('python', ["./test.py", req.params.variable]);
//     let body = "";
//     pythonProcess.stdout.on('data', (data) => {
//         body += data;
//         body = JSON.parse(body);
//     });
//     pythonProcess.stdout.on('end', function () {
//         console.log(body);
//         return res.status(200).json(body);
//     });

//     pythonProcess.stderr.on('data', (data) => {
//         return res.status(400).send(data);
//     });
// })

router.get('/analytica/tweet/search/:variable', async (req, res) => {
    let count = 0;
    let api_endpoint = `https://api.twitter.com/2/tweets/search/recent?query=${req.params.variable} -is:retweet&expansions=author_id&max_results=100&media.fields=public_metrics&tweet.fields=public_metrics,created_at&user.fields=username,location`;
    let response = await axios.get(api_endpoint, config);
    let tweets = response.data.data;
    count += tweets.length;
    let all_tweets = tweets;
    let next_token = response.data.meta.next_token;
    while (count < 1000) {
        response = await axios.get(`${api_endpoint}&next_token=${next_token}`, config)
        tweets = response.data.data;
        count += tweets.length;
        all_tweets = all_tweets.concat(tweets);
        next_token = response.data.meta.next_token;
    }
    console.log(count)
    return res.status(200).json({
        all_tweets
    })
})

// router.get('/analytica/tweet/search/:variable', async (req, res) => {
//     let count = 0;
//     let all_tweets = [];
//     let api_endpoint = `https://api.twitter.com/1.1/search/tweets.json?q=${req.params.variable} -filter:retweets&lang=en&count=100&tweet_mode=extended`;
//     let response = await axios.get(api_endpoint, config);
//     let tweets = response.data.statuses;
//     tweets.forEach(tweet => {
//         all_tweets.unshift({
//             "id": tweet.id,
//             "text": tweet.full_text,
//             "username": tweet.user.screen_name,
//             "created_at": tweet.created_at,
//             "favourite_count": tweet.favorite_count,
//             "retweet_count": tweet.retweet_count
//         })
//         count++;
//     });
//     next_results = response.data.search_metadata.next_results;
//     while (count < 1000) {
//         response = await axios.get(`https://api.twitter.com/1.1/search/tweets.json${next_results}`, config)
//         tweets.forEach(tweet => {
//             all_tweets.unshift({
//                 "id": tweet.id,
//                 "text": tweet.full_text,
//                 "username": tweet.user.screen_name,
//                 "created_at": tweet.created_at,
//                 "favourite_count": tweet.favorite_count,
//                 "retweet_count": tweet.retweet_count
//             })
//             count++;
//         });
//         next_results = response.data.search_metadata.next_results;
//     }
//     console.log(count);
//     return res.status(200).json({
//         all_tweets
//     })
// })

module.exports = router;