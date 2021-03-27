const axios = require('axios');

const config = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    }
}

const worldwideTrends = async (req, res) => {
    try {
        let response = await axios.get(`https://api.twitter.com/1.1/trends/place.json?id=1`, config);
        let trends = response.data[0].trends;
        return res.status(200).json(trends);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const nearbyTrends = async (req, res) => {
    try {
        let locationResponse = await axios.get(`https://api.twitter.com/1.1/trends/closest.json?lat=15.283219&long=73.986191`, config);
        let myWoeID = locationResponse.data[0].woeid;
        let trendResponse = await axios.get(`https://api.twitter.com/1.1/trends/place.json?id=${myWoeID}`, config);
        let trends = trendResponse.data[0].trends;
        return res.status(200).json(trends);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    worldwideTrends,
    nearbyTrends
}