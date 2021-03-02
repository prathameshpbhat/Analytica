require('dotenv').config()

const express = require('express')
const path = require('path')
const jwttoken = require('jsonwebtoken')
const app = express()
PORT = process.env.PORT || 3000
require('./mongooseconnect/mongoose_connect')
//ROUTES
const login_route = require('./routes/login')
const test = require('./routes/test')

const search_route = require('./routes/twitterapi/search')
const usertweets = require('./routes/twitterapi/user/tweets')
const usermentions = require('./routes/twitterapi/user/mentions')
const trends = require('./routes/twitterapi/trends')
//


app.use(express.urlencoded({
  extended: true
}));


app.use(login_route)
app.use(test)

app.use(search_route);
app.use(usertweets);
app.use(usermentions);
app.use(trends);

app.listen(PORT, () => {
  console.log('server started')
})