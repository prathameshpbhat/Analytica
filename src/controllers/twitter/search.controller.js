const axios = require("axios");
const twitter_search = require("../../models/twitter/search");

const startSearch = async (req, res) => {
  const search_query = req.body.search_query;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url =
    "http://ec2-13-232-103-177.ap-south-1.compute.amazonaws.com:5000/twitter-search";
  console.log(req.user._id);
  try {
    let request_payload = {
      query: search_query,
      mode: 1,
      Author: req.user._id,
    };
    let response = await axios.post(url, request_payload, config);

    if (response.status == 202) {
      return res.status(202).json({
        status: "The request has been accepted. Please wait",
        documentId: response.data.documentId,
      });
    } else {
      return res.status(response.status).json({
        status: "The request did not work. Please try again",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.toString(),
    });
  }
};

const checkSearchStatus = async (req, res) => {
  try {
    const search = await twitter_search.findById(req.params.documentId);
    if (search) {
      if (search.status == 0) {
        return res.status(204).send();
      } else if (search.status == 1) {
        return res.status(200).json({
          status: "The response is ready.",
        });
      }
    } else {
      return res.status(404).json({
        error: "Search not made",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString(),
    });
  }
};

const downloadSearchResults = (req, res) => {
  twitter_search
    .findById(req.params.documentId)
    .then((search) => {
      if (search) {
        let positiveArray = [];
        let negativeArray = [];
        let neutralArray = [];
        search.results.forEach((el) => {
          if (el.sentiment == "Positive") {
            positiveArray.push(el);
          } else if (el.sentiment == "Negative") {
            negativeArray.push(el);
          } else if (el.sentiment == "Neutral") {
            neutralArray.push(el);
          }
        });

        return res.status(200).json({
          positives: positiveArray,
          numberOfPositives: positiveArray.length,
          negatives: negativeArray,
          numberOfNegatives: negativeArray.length,
          neutrals: neutralArray,
          numberOfNeutrals: neutralArray.length,
        });
      } else {
        return res.status(404).json({
          error: "Search not made",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.toString(),
      });
    });
};

const downloadAllSearchResults = async (req, res) => {
  try {
    console.log("User Id: " + req.user._id);
    const results = await twitter_search
      .find({ Author: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({
      Error: e.toString(),
    });
  }
};

module.exports = {
  startSearch,
  checkSearchStatus,
  downloadSearchResults,
  downloadAllSearchResults,
};
