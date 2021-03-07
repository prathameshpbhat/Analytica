const express = require('express');
const router = express.Router();
const axios = require('axios');

const config = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    }
}

router.get('/analytica/tweet/personal/:username/mentions', async (req, res) => {
    console.log("raunak here")
    // try {
        let userid = await axios.get(`https://api.twitter.com/2/users/by/username/${req.params.username}`, config);
        userid = userid.data.data.id;
        let count = 0;

        let api_endpoint = `https://api.twitter.com/2/users/${userid}/mentions?max_results=100&media.fields=public_metrics&tweet.fields=public_metrics,created_at`
        let response = await axios.get(api_endpoint, config);
        let mentions = response.data.data;
        let all_mentions = mentions;
        let next_token = response.data.meta.next_token;
        while (next_token) {
            response = await axios.get(`${api_endpoint}&pagination_token=${next_token}`, config)
            mentions = response.data.data;
            all_mentions = all_mentions.concat(mentions);
            next_token = response.data.meta.next_token;
        }
        for (tweet in all_mentions) {
            count++;
        }
        return res.status(200).json({
            all_mentions
        });
    // } 
    // catch (error) {
    //     return res.status(400).json(error);
    // }
});

router.get('/analytica/tweet/personal/:username/mentions/today', async (req, res) => {
    try {
        let userid = await axios.get(`https://api.twitter.com/2/users/by/username/${req.params.username}`, config);
        userid = userid.data.data.id;

        let count = 0;
        let d = new Date();
        d.setHours(0, 0, 0, 0);
        d = d.toISOString()

        let api_endpoint = `https://api.twitter.com/2/users/${userid}/mentions?max_results=100&start_time=${d}&media.fields=public_metrics&tweet.fields=public_metrics,created_at`
        let response = await axios.get(api_endpoint, config);
        let mentions = response.data.data;
        let all_mentions = mentions;
        let next_token = response.data.meta.next_token;
        while (next_token) {
            response = await axios.get(`${api_endpoint}&pagination_token=${next_token}`, config)
            mentions = response.data.data;
            all_mentions = all_mentions.concat(mentions);
            next_token = response.data.meta.next_token;
        }
        for (tweet in all_mentions) {
            count++;
        }
        return res.status(200).json({
            all_mentions
        });
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = router;