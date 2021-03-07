const express= require('express')
const axios =require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../../middleware/isloggedin');

const InstaClient = new Insta();
const router = express.Router();

const twitterDb=require('../../../models/twitter');
const route = require('../../instagramapi/instagramdb');

router.get('/twitter/tags/:documentId/status',async (req,res)=>{


    let documenID=req.params.tag;
    let data;
    try{
      data =await twitterDb.findById(documenID);
      if(data.status==1){
        res.send({status:data.status,result:data})
      }
      else{
        res.send({status:0})
  
      }
    }

    
    catch(e){
      res.send({status:-1,error:e})
  
    }
   
  })

  router.get('/twitter/alltags',async (req,res)=>{



    let data;
    try{
      data =await twitterDb.find({Author:req.body.username});
   
        res.send({result:data})
    }
    catch(e){
      res.send({status:-1,error:e})
  
    }
   
  
  
  
  
  
  
  
  })


  module.exports=route;