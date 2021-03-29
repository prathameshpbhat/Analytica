const axios = require("axios");
const twitter_search = require("../../models/twitter");

const startSearch = async (req, res) => {
  const search_query = req.body.search_query;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = "https://sentiment-analysis-micro.herokuapp.com/search";
  try {
    let request_payload = {
      query: search_query,
      mode: 1,
      Author: req.body.user,
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
        b;
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
        search.results.forEach((el) => {
          if (el.sentiment == "Positive") {
            positiveArray.push(el);
          } else if (el.sentiment == "Negative") {
            negativeArray.push(el);
          }
        });

        return res.status(200).json({
          positives: positiveArray,
          numberOfPositives: positiveArray.length,
          negatives: negativeArray,
          numberOfNegatives: negativeArray.length,
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

module.exports = {
  startSearch,
  checkSearchStatus,
  downloadSearchResults,
};
