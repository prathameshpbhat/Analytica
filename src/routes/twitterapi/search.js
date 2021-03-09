const express = require('express');
const router = express.Router();
const axios = require("axios");
const Search = require('../../models/search');
const isLoggedIn = require("../../middleware/isloggedin")


router.post('/analytica/twitter/search', isLoggedIn, async (req, res) => {


    if (!req.token) {
        return res.status(401).send({
            error: "user not authorised"
        });
    }

    const search_query = req.body.search_query;
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const url = "https://sentiment-analysis-micro.herokuapp.com/search"
    try {
        let request_payload = {
            query: search_query,
            mode: 1
        }
        let response = await axios.post(url, request_payload, config);

        if (response.status == 202) {
            return res.status(202).json({
                "status": "The request has been accepted. Please wait",
                "documentId": response.data.documentId
            });
        } else {
            return res.status(response.status).json({
                "status": "The request did not work. Please try again"
            })
        }
    } catch (error) {
        return res.status(500).json({
            "error": error.toString()
        })
    }
})

router.get('/analytica/twitter/search/status', (req, res) => {
    Search.findById(req.query.documentId).then(search => {
        if (search) {
            if (search.status == 0) {
                return res.status(204).send();
            } else if (search.status == 1) {
                return res.status(200).json({
                    "status": "The response is ready."
                });
            }
        } else {
            return res.status(404).json({
                error: "Search not made"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            error: err.toString()
        })
    })
})

router.get('/analytica/twitter/search/download', (req, res) => {
    Search.findById(req.query.documentId).then(search => {
        if (search) {
            return res.status(200).json({
                Result: search.results
            })
        } else {
            return res.status(404).json({
                error: "Search not made"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            error: err.toString()
        })
    })
})

module.exports = router;