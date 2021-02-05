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

const search_route = require('./routes/search')
const userovertime = require('./routes/user/overtime')
const usertoday = require('./routes/user/today')
const usermentions = require('./routes/user/mentions')
//


app.use(express.urlencoded({
  extended: true
}));


app.use(login_route)
app.use(test)

app.use(search_route);
app.use(userovertime);
app.use(usertoday);
app.use(usermentions);

app.listen(PORT, () => {
  console.log('server started')
})