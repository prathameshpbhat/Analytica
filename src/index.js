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


const usertweets = require('./routes/twitterapi/user/tweets')
const usermentions = require('./routes/twitterapi/user/mentions')
const trends = require('./routes/twitterapi/trends')
const instagramRoute = require('./routes/instagramapi/instagram')
const instagramdb = require('./routes/instagramapi/instagramdb')
const twitterDB = require('./routes/twitterapi/database/twitterdb')
const searchRoute = require('./routes/twitterapi/search')
//

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));


app.use(twitterDB);
app.use(searchRoute);
app.use(usermentions);
app.use(instagramdb)
app.use(instagramRoute)
app.use(login_route)
app.use(test)
app.use(usertweets);
app.use(trends);



app.listen(PORT, () => {
  console.log('server started')
})