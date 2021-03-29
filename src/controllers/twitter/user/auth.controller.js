const axios = require('axios');
const oauth = require(`../../../libs/oauthv1`);

const query_params_to_json = (queryParams) => {
    return JSON.parse('{"' + decodeURI(queryParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

const verifyLogin = async (req, res) => {
    try {
        const api_endpoint = 'https://api.twitter.com/1.1/account/verify_credentials.json'
        const options = {
            method: "GET",
            url: api_endpoint,
            oauth_token: req.query.oauth_token,
            oauth_token_secret: req.query.oauth_token_secret
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: oauth.generateAuthHeader(options)
            }
        }
        const response = await axios.get(api_endpoint, headers);
        res.status(200).json({
            "user_details": response.data
        })
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(500).json(error.toString())
        }
    }
}

const loginCallback = async (req, res) => {
    try {
        const response = await axios.post(`https://api.twitter.com/oauth/access_token?oauth_token=${req.body.oauth_token}&oauth_verifier=${req.body.oauth_verifier}`);
        const response_data = query_params_to_json(response.data)
        res.status(200).json(response_data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(400).json(error.toString())
        }
    }
}

const startLogin = async (req, res) => {
    try {
        const api_endpoint = `https://api.twitter.com/oauth/request_token`;
        const params = new URLSearchParams()
        params.append('oauth_callback', "http://localhost:8080/twitter/login-next")
        const options = {
            method: "POST",
            url: api_endpoint,
            params: {
                oauth_callback: "http://localhost:8080/twitter/login-next"
            }
        }
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: oauth.generateAuthHeader(options)
            }
        }
        const response = await axios.post(api_endpoint, params, headers);
        const response_data = query_params_to_json(response.data)
        return res.status(200).json({
            redirectUri: `https://twitter.com/oauth/authenticate?oauth_token=${response_data.oauth_token}`,
            oauthRequestToken: response_data.oauth_token,
        });
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error);
        } else {
            return res.status(500).json(error.toString())
        }
    }
}

module.exports = {
    verifyLogin,
    loginCallback,
    startLogin
}