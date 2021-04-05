const express = require("express");
const axios = require("axios");
const router = express.Router();
const Nodemailer =require('../../email/newemail/sendNewRegistrationEmail')
router.get("/test/testmail",async (req, res) => {
 

    let sendEmailto=req.body.Email;
    console.log(sendEmailto)
  try{
await Nodemailer(sendEmailto)
res.status(200).json({status:'email sent'})
  }
  catch(e){
    res.status(400).json({status:e})
  }


    })

      module.exports = router;
