const USER=require('../models/users')
const express=require('express')
const auth=require('../middleware/auth')
const route=express.Router();


route.get('/twitter/me',auth,(req,res)=>{
    res.status(200).json({
        user:req.user,
        status:'success'
    })

})


module.exports=route

