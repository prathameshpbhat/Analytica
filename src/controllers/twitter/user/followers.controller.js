const oauth = require("../../../libs/oauthv1");
const axios = require("axios");

const getFollowers = async (req, res) => {
  try {
    let followers = [];
    let next_token = "";
    const api_endpoint = `https://api.twitter.com/2/users/15506669/followers`;

    const params = {
      max_results: 100,
      "user.fields":
        "created_at,location,profile_image_url,url,verified,public_metrics",
    };
    const options = {
      method: "GET",
      url: api_endpoint,
      params: params,
    };
    const config = {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.get(api_endpoint, config);
    followers = followers.concat(response.data.data);
    console.log(`Number of followers: ${followers.length}`);
    return res.status(response.status).json(followers);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).send(error);
    } else {
      return res.status(500).send(error.toString());
    }
  }
};

module.exports = {
  getFollowers,
};
