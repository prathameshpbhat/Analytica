require('dotenv').config()

const express = require('express')
const path = require('path')
const jwttoken = require('jsonwebtoken')
const cors=require('cors')

const app = express()
PORT = process.env.PORT || 3000
require('./mongooseconnect/mongoose_connect')


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

//ROUTES
const login_route = require('./routes/login')


const twitterDB = require('./routes/twitterapi/database/twitterdb')
const twitter_authRoute = require('./routes/twitterapi/user/auth')
const twitter_searchRoute = require('./routes/twitterapi/search')
const twitter_userTweets = require('./routes/twitterapi/user/tweets')
const twitter_usermentions = require('./routes/twitterapi/user/mentions')
const twitter_trends = require('./routes/twitterapi/trends')

const instagramRoute = require('./routes/instagramapi/instagram')
const instagramdb = require('./routes/instagramapi/instagramdb')

//

app.use(login_route)

app.use(twitterDB);
app.use(twitter_authRoute);
app.use(twitter_searchRoute);
app.use(twitter_userTweets);
app.use(twitter_usermentions);
app.use(twitter_trends);

app.use(instagramdb)
app.use(instagramRoute)


app.listen(PORT, () => {
  console.log('server started')
})