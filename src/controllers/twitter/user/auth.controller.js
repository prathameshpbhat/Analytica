const axios = require("axios");
const jwt = require("jsonwebtoken");
const oauth = require(`../../../libs/oauthv1`);

const User = require("../../../models/users");

const query_params_to_json = (queryParams) => {
  return JSON.parse(
    '{"' +
      decodeURI(queryParams)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
};

const verifyLogin = async (req, res) => {
  try {
    const api_endpoint =
      "https://api.twitter.com/1.1/account/verify_credentials.json";
    const options = {
      method: "GET",
      url: api_endpoint,
      oauth_token: req.query.oauth_token,
      oauth_token_secret: req.query.oauth_token_secret,
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.get(api_endpoint, headers);
    let userData = response.data;
    const token = await jwt.sign(
      {
        oauth_token: req.query.oauth_token,
        oauth_token_secret: req.query.oauth_token_secret,
      },
      process.env.JWTTOKEN
    );
    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $set: {
          "twitter.user_details": userData,
          "twitter.access_jwt": token,
        },
      }
    );
    return res.status(200).json({
      user_details: updatedUser.twitter.user_details,
    });
  } catch (error) {
    if (error.response) {
      console.log(error);
      return res.status(error.response.status).json(error);
    } else {
      throw new Error(error);
    }
  }
};

const loginCallback = async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.twitter.com/oauth/access_token?oauth_token=${req.body.oauth_token}&oauth_verifier=${req.body.oauth_verifier}`
    );
    const response_data = query_params_to_json(response.data);
    res.status(200).json(response_data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      throw new Error(error);
    }
  }
};

const startLogin = async (req, res) => {
  try {
    const api_endpoint = `https://api.twitter.com/oauth/request_token`;
    const params = new URLSearchParams();
    params.append(
      "oauth_callback",
      "https://project-backend-test-client.herokuapp.com/twitter/login-next"
    );
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        oauth_callback:
          "https://project-backend-test-client.herokuapp.com/twitter/login-next",
      },
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    console.log("yo");
    const response = await axios.post(api_endpoint, params, headers);
    const response_data = query_params_to_json(response.data);
    console.log("yo");
    return res.status(200).json({
      redirectUri: `https://twitter.com/oauth/authenticate?oauth_token=${response_data.oauth_token}`,
      oauthRequestToken: response_data.oauth_token,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error);
    } else {
      throw new Error(error);
    }
  }
};

module.exports = {
  verifyLogin,
  loginCallback,
  startLogin,
};
