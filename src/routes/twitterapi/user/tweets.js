const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const rootPath = path.dirname(require.main.filename)
const oauth = require(`${rootPath}/oauthv1`);
const User = require('../../../models/users');

mongoose.set('useFindAndModify', false);

// All the api requests

// MAKE TWEET (Post status)
router.post('/analytica/tweet/personal/update-status', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/update.json`;
        const params = new URLSearchParams()
        params.append('status', req.body.status)
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint, {
                    status: req.body.status
                })
            }
        }
        const response = await axios.post(api_endpoint, params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// REPLY TO A TWEET
router.post('/analytica/tweet/personal/reply/:tweetid', async (req, res) => {
    try {
        const tweetid = req.params.tweetid;
        const userResponse = await axios.get(`https://api.twitter.com/1.1/statuses/show.json?id=${tweetid}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('GET', `https://api.twitter.com/1.1/statuses/show.json`, {
                    id: tweetid
                })
            }
        });
        const username = userResponse.data.user.screen_name;
        const api_endpoint = `https://api.twitter.com/1.1/statuses/update.json`;
        const params = new URLSearchParams()
        params.append('status', `@${username} ${req.body.status}`)
        params.append('in_reply_to_status_id', tweetid)
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint, {
                    status: `@${username} ${req.body.status}`,
                    in_reply_to_status_id: tweetid
                })
            }
        }
        const response = await axios.post(api_endpoint, params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// DELETE TWEET
router.delete('/analytica/tweet/personal/delete-status/:tweetid', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/destroy/${req.params.tweetid}.json`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint)
            }
        }
        const response = await axios.post(api_endpoint, {}, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// RETWEET A TWEET
router.post('/analytica/tweet/personal/retweet/:tweetid', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/retweet/${req.params.tweetid}.json`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint)
            }
        }
        const response = await axios.post(api_endpoint, {}, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// UNRETWEET A TWEET
router.post('/analytica/tweet/personal/unretweet/:tweetid', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/unretweet/${req.params.tweetid}.json`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint)
            }
        }
        let response = await axios.post(api_endpoint, {}, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// LIKE TWEET
router.post('/analytica/tweet/personal/favourite', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/favorites/create.json`;
        const params = new URLSearchParams();
        params.append('id', req.body.tweetid)
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint, {
                    id: req.body.tweetid
                })
            }
        }
        let response = await axios.post(api_endpoint, params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// REMOVE LIKE FROM TWEET
router.post('/analytica/tweet/personal/unfavourite', async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/1.1/favorites/destroy.json`;
        const params = new URLSearchParams();
        params.append('id', req.body.tweetid)
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader('POST', api_endpoint, {
                    id: req.body.tweetid
                })
            }
        }
        const response = await axios.post(api_endpoint, params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
})

// GET RECENT LIKED TWEETS OF USER
router.get('/analytica/tweet/personal/favourite-list', async (req, res) => {
    try {
        let count = 0;
        const api_endpoint = `https://api.twitter.com/1.1/favorites/list.json`;
        const api_parameters = `?count=200`
        const response = await axios.get(`${api_endpoint}${api_parameters}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
                    'count': '200'
                })
            }
        });
        const tweets = response.data;

        for (tweet in tweets) {
            count++;
        }
        return res.status(res.statusCode).json({
            tweets
        })
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
});

// GET ALL TWEETS OAUTH v1.0
router.post('/analytica/tweet/personal/engagement', async (req, res) => {
    try {
        const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${req.body.username}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('GET', `https://api.twitter.com/2/users/by/username/${req.body.username}`)
            }
        });
        let userid = "";
        if (userResponse.data.data) {
            userid = userResponse.data.data.id;
        } else {
            return res.status(400).json({
                Error: userResponse.data
            })
        }

        let documentId = "";
        const user = await User.findOne({
            username: req.body.username
        })
        if (user) {
            documentId = user.id;
        } else {
            let userTweets = new User({
                status: 0,
                username: req.body.username,
                results: [],
                count: 0,
                retweets: "no"
            });
            const newUser = await User.create(userTweets);

            documentId = newUser._id;
        }

        res.status(202).json({
            "status": "The request has been accepted. Please wait",
            "documentId": documentId
        });

        try {

            let count = 0;
            const api_endpoint = `https://api.twitter.com/2/users/${userid}/tweets`;
            const api_parameters = `?expansions=in_reply_to_user_id,referenced_tweets.id&exclude=retweets&max_results=100&tweet.fields=public_metrics,created_at,conversation_id`
            let response = await axios.get(`${api_endpoint}${api_parameters}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
                        'expansions': 'in_reply_to_user_id,referenced_tweets.id',
                        'exclude': 'retweets',
                        'max_results': '100',
                        'tweet.fields': 'public_metrics,created_at,conversation_id'
                    })
                    // Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                }
            });
            let tweets = response.data.data;
            let all_tweets = tweets;
            let next_token = response.data.meta.next_token;
            while (next_token) {
                response = await axios.get(`${api_endpoint}${api_parameters}&pagination_token=${next_token}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
                            'expansions': 'in_reply_to_user_id,referenced_tweets.id',
                            'exclude': 'retweets',
                            'max_results': '100',
                            'tweet.fields': 'public_metrics,created_at,conversation_id',
                            'pagination_token': next_token
                        })
                        // Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                    }
                })
                tweets = response.data.data;
                all_tweets = all_tweets.concat(tweets);
                next_token = response.data.meta.next_token;
            }

            for (tweet in all_tweets) {
                count++;
            }
            const updateUser = {
                status: 1,
                results: all_tweets,
                count: count
            };

            await User.findByIdAndUpdate(documentId, updateUser);
        } catch (error) {
            console.log(`Error:  ${error}`)
        }
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                "error": error
            });
        } else {
            return res.status(500).json({
                "error": error.toString()
            });
        }
    }
});

router.get('/analytica/tweet/personal/engagement/status', async (req, res) => {
    // await User.findById(req.query.documentId).then(user => {
    //     if (user) {
    //         if (search.status == 0) {
    //             return res.status(202).json({
    //                 status: 0
    //             })
    //         } else if (search.status == 1) {
    //             return res.status(200).json({
    //                 status: 1,
    //                 Result: search.results
    //             })
    //         }
    //     } else {
    //         return res.status(404).json({
    //             error: "Search not made"
    //         })
    //     }
    // }).catch(err => {
    //     return res.status(500).json({
    //         error: err
    //     })
    // })
});

// GET TWEETS MADE TODAY
router.get('/analytica/tweet/personal/:username/engagement/today', async (req, res) => {
    try {
        const userResponse = await axios.get(`
                https://api.twitter.com/2/users/by/username/${req.params.username}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('GET', `https://api.twitter.com/2/users/by/username/${req.params.username}`)
            }
        });
        userid = userResponse.data.data.id;

        let d = new Date();
        d.setHours(0, 0, 0, 0);
        d = d.toISOString();

        let count = 0;
        const api_endpoint = `https://api.twitter.com/2/users/${userid}/tweets`;
        const api_parameters = `?exclude=retweets&start_time=${d}&max_results=100&tweet.fields=public_metrics,created_at`
        let response = await axios.get(`${api_endpoint}${api_parameters}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
                    'exclude': 'retweets',
                    'start_time': d,
                    'max_results': '100',
                    'tweet.fields': 'public_metrics,created_at'
                })
            }
        });
        let tweets = response.data.data;
        let all_tweets = tweets;
        // let next_token = response.data.meta.next_token;
        // while (next_token) {
        //     response = await axios.get(`${api_endpoint}${api_parameters}&pagination_token=${next_token}`, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
        //                 'exclude': 'retweets',
        //                 'start_time': d,
        //                 'max_results': '100',
        //                 'tweet.fields': 'public_metrics,created_at',
        //                 'pagination_token': next_token
        //             })
        //         }
        //     })
        //     tweets = response.data.data;
        //     all_tweets = all_tweets.concat(tweets);
        //     next_token = response.data.meta.next_token;
        // }
        for (tweet in all_tweets) {
            count++;
        }
        return res.status(res.statusCode).json({
            all_tweets
        })
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
});

module.exports = router;