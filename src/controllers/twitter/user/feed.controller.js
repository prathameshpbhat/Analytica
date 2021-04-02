const followersController = require("../../../controllers/twitter/user/followers.controller");

const getFollowers = async (userid) => {
  try {
    let followers = [];
    let next_token = "";
    let requestCount = 1;
    const api_endpoint = `https://api.twitter.com/2/users/${userid}/followers`;

    const params = {
      max_results: 1000,
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
    console.log(`Request: ${requestCount}`);
    requestCount++;
    const response = await axios.get(api_endpoint, config);
    followers = followers.concat(response.data.data);
    next_token = response.data.meta.next_token;
    while (next_token) {
      const params = {
        max_results: 1000,
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
      console.log(`Request: ${requestCount}`);
      requestCount++;
      const response = await axios.get(api_endpoint, config);
      followers = followers.concat(response.data.data);
      next_token = response.data.meta.next_token;
      if (requestCount > 2) break;
    }
    console.log(`Number of followers: ${followers.length}`);
    return Promise.resolve(followers);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getFeed = async (req, res) => {
  try {
    const followers = getFollowers(req.user.twitter.user_details.id_str);
    return res.status(200).json(followers);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    }
    console.log(error);
  }
};

module.exports = {
  getFeed,
};
