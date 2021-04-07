const express = require("express");
const axios = require("axios");
const router = express.Router();
const Nodemailer =require('./sendGrid')

const mainData=require('../../jsonFileData/json')
router.get("/test/testmail",async (req, res) => {
 

    let sendEmailto=req.body.Email;
    console.log(sendEmailto)
   await Nodemailer(sendEmailto);
    res.status(200).json({status:"best"})
//   try{
// await Nodemailer(sendEmailto)
// res.status(200).json({status:'email sent'})
//   }
//   catch(e){
//     res.status(400).json({status:e})
//   }


    })
router.get('/test/jsonTest',(req,res)=>{
  res.send({
    url:mainData.urlFrontEnd
  })
})
      module.exports = router;
