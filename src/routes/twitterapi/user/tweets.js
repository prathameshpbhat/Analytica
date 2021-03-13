const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const oauth = require(`../../../libs/oauthv1`);
const isloggedin = require('../../../middleware/isloggedin');
// const User = require(`../../../models/twitterapi/user`);

mongoose.set('useFindAndModify', false);

// All the api requests

// MAKE TWEET (Post status)
router.post('/analytica/twitter/personal/update-status', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const api_endpoint = `https://api.twitter.com/1.1/statuses/update.json`;
        const options = {
            method: 'POST',
            url: api_endpoint,
            params: {
                status: req.body.status
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader(options)
            }
        }
        const params = new URLSearchParams()
        params.append('status', req.body.status)
        const response = await axios.post(api_endpoint, params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(500).json(error.toString())
        }
    }
})

// REPLY TO A TWEET
router.post('/analytica/twitter/personal/reply/:tweetid', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const tweetid = req.params.tweetid;
        const getUsernameOptions = {
            method: 'GET',
            url: "https://api.twitter.com/1.1/statuses/show.json",
            params: {
                id: tweetid
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const userResponse = await axios.get(`https://api.twitter.com/1.1/statuses/show.json?id=${tweetid}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(getUsernameOptions)
            }
        });
        const username = userResponse.data.user.screen_name;

        const postReplyOptions = {
            method: 'POST',
            url: "https://api.twitter.com/1.1/statuses/update.json",
            params: {
                status: `@${username} ${req.body.status}`,
                in_reply_to_status_id: tweetid
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader(postReplyOptions)
            }
        }
        const params = new URLSearchParams()
        params.append('status', `@${username} ${req.body.status}`)
        params.append('in_reply_to_status_id', tweetid)
        const response = await axios.post("https://api.twitter.com/1.1/statuses/update.json", params, headers);
        return res.status(res.statusCode).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(500).json(error.toString())
        }
    }
})

// DELETE TWEET
router.delete('/analytica/twitter/personal/delete-status/:tweetid', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/destroy/${req.params.tweetid}.json`;
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const options = {
            method: 'POST',
            url: api_endpoint,
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(options)
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
router.post('/analytica/twitter/personal/retweet/:tweetid', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/retweet/${req.params.tweetid}.json`;
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const options = {
            method: 'POST',
            url: api_endpoint,
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(options)
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
router.post('/analytica/twitter/personal/unretweet/:tweetid', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        const api_endpoint = `https://api.twitter.com/1.1/statuses/unretweet/${req.params.tweetid}.json`;
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const options = {
            method: 'POST',
            url: api_endpoint,
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(options)
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
router.post('/analytica/twitter/personal/favourite', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        const api_endpoint = `https://api.twitter.com/1.1/favorites/create.json`;
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const options = {
            method: 'POST',
            url: api_endpoint,
            params: {
                id: req.body.tweetid
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader(options)
            }
        }
        const params = new URLSearchParams();
        params.append('id', req.body.tweetid)
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
router.post('/analytica/twitter/personal/unfavourite', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        const api_endpoint = `https://api.twitter.com/1.1/favorites/destroy.json`;
        // const oauth_token = req.body.oauth_token;
        // const oauth_token_secret = req.body.oauth_token_secret;
        const options = {
            method: 'POST',
            url: api_endpoint,
            params: {
                id: req.body.tweetid
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader(options)
            }
        }
        const params = new URLSearchParams();
        params.append('id', req.body.tweetid)
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
router.get('/analytica/twitter/personal/favourite-list', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        let count = 0;
        const api_endpoint = `https://api.twitter.com/1.1/favorites/list.json`;
        const api_parameters = `?count=200`
        // const oauth_token = req.query.oauth_token;
        // const oauth_token_secret = req.query.oauth_token_secret;
        const options = {
            method: 'GET',
            url: api_endpoint,
            params: {
                'count': '200'
            },
            // oauth_token: oauth_token,
            // oauth_token_secret: oauth_token_secret
        }
        const response = await axios.get(`${api_endpoint}${api_parameters}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(options)
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

// ACCEPT REQUEST AND WRITE RESPONSE TWEETS TO DATABASE
router.post('/analytica/twitter/personal/tweets', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        let documentId = "";
        const user = await User.findOne({
            userid: req.body.userid
        })
        if (user) {
            documentId = user.id;
        } else {
            let userTweets = new User({
                status: 0,
                userid: req.body.userid,
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
            const api_endpoint = `https://api.twitter.com/2/users/${req.body.userid}/tweets`;
            const api_parameters = `?expansions=in_reply_to_user_id,referenced_tweets.id&exclude=retweets&max_results=100&tweet.fields=public_metrics,created_at,conversation_id`
            // const oauth_token = req.body.oauth_token;
            // const oauth_token_secret = req.body.oauth_token_secret;
            const options = {
                method: 'GET',
                url: api_endpoint,
                params: {
                    'expansions': 'in_reply_to_user_id,referenced_tweets.id',
                    'exclude': 'retweets',
                    'max_results': '100',
                    'tweet.fields': 'public_metrics,created_at,conversation_id'
                },
                // oauth_token: oauth_token,
                // oauth_token_secret: oauth_token_secret
            }
            let response = await axios.get(`${api_endpoint}${api_parameters}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: oauth.generateAuthHeader(options)
                }
            });
            let tweets = response.data.data;
            let all_tweets = tweets;
            let next_token = response.data.meta.next_token;
            while (next_token) {
                const options = {
                    method: 'GET',
                    url: api_endpoint,
                    params: {
                        'expansions': 'in_reply_to_user_id,referenced_tweets.id',
                        'exclude': 'retweets',
                        'max_results': '100',
                        'tweet.fields': 'public_metrics,created_at,conversation_id',
                        'pagination_token': next_token
                    },
                    // oauth_token: oauth_token,
                    // oauth_token_secret: oauth_token_secret
                }
                response = await axios.get(`${api_endpoint}${api_parameters}&pagination_token=${next_token}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: oauth.generateAuthHeader(options)
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

// RETURN STATUS OF RESPONSE (POLLING)
router.get('/analytica/twitter/personal/tweets/status', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    await User.findById(req.query.documentId).then(user => {
        if (user) {
            if (search.status == 0) {
                return res.status(204).send();
            } else if (search.status == 1) {
                return res.status(200).json({
                    status: 1,
                    Result: search.results
                })
            }
        } else {
            return res.status(404).json({
                error: "Search not made"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            error: err
        })
    })
});

// DOWNLOAD THE COMPLETE RESPONSE
router.get('/analytica/twitter/personal/tweets/download', isloggedin, (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    User.findById(req.query.documentId).then(user => {
        if (user) {
            return res.status(200).json({
                Result: user.results
            })
        } else {
            return res.status(404).json({
                error: "User's tweets not found"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            error: err
        })
    })
})

// GET TWEETS MADE TODAY
router.get('/analytica/twitter/personal/tweets/today', isloggedin, async (req, res) => {
    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    try {
        let d = new Date();
        d.setHours(0, 0, 0, 0);
        d = d.toISOString();

        let count = 0;
        const api_endpoint = `https://api.twitter.com/2/users/${req.body.userid}/tweets`;
        const api_parameters = `?exclude=retweets&start_time=${d}&max_results=100&tweet.fields=public_metrics,created_at`
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
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                // Authorization: oauth.generateAuthHeader(options)
            }
        });
        let tweets = response.data.data;
        let all_tweets = tweets;
        let next_token = response.data.meta.next_token;
        while (next_token) {
            response = await axios.get(`${api_endpoint}${api_parameters}&pagination_token=${next_token}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                    // Authorization: oauth.generateAuthHeader('GET', api_endpoint, {
                    //     'exclude': 'retweets',
                    //     'start_time': d,
                    //     'max_results': '100',
                    //     'tweet.fields': 'public_metrics,created_at',
                    //     'pagination_token': next_token
                    // })
                }
            })
            tweets = response.data.data;
            all_tweets = all_tweets.concat(tweets);
            next_token = response.data.meta.next_token;
        }
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