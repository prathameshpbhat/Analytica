const express =require('express')
const path = require('path')
const jwttoken=require('jsonwebtoken')
const app =express()
PORT = 3000||process.env.PORT
require('./mongooseconnect/mongoose_connect')
//ROUTES
const login_route=require('./routes/login')
const test=require('./routes/test')
//


app.use(express.urlencoded({
    extended: true
  }));




app.use(login_route)
app.use(test)


app.listen(PORT,()=>
{
    console.log('server started')
})