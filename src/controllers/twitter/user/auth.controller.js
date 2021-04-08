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
    const tokens = jwt.verify(
      req.user.twitter.access_jwt,
      process.env.JWTTOKEN
    );
    const options = {
      method: "GET",
      url: api_endpoint,
      oauth_token: tokens.oauth_token,
      oauth_token_secret: tokens.oauth_token_secret,
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.get(api_endpoint, headers);
    let userData = response.data;
    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $set: {
          "twitter.user_details": userData,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      user_details: updatedUser.twitter.user_details,
    });
  } catch (error) {
    if (error.response) {
      console.log(error);
      return res.status(error.response.status).json(error);
    } else {
      console.log(error);
      return res.status(500).send();
    }
  }
};

const loginCallback = async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.twitter.com/oauth/access_token?oauth_token=${req.body.oauth_token}&oauth_verifier=${req.body.oauth_verifier}`
    );
    const response_data = query_params_to_json(response.data);
    const token = jwt.sign(
      {
        oauth_token: response_data.oauth_token,
        oauth_token_secret: response_data.oauth_token_secret,
      },
      process.env.JWTTOKEN
    );

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $set: {
          "twitter.access_jwt": token,
        },
      },
      { new: true }
    );

    res.status(200).send();
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
      "http://analytica-front.herokuapp.com/Dashboard/twitter/login-next"
    );
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        oauth_callback:
          "http://analytica-front.herokuapp.com/Dashboard/twitter/login-next",
      },
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const response = await axios.post(api_endpoint, params, headers);
    const response_data = query_params_to_json(response.data);
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
