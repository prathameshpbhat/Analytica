const express= require('express')
const axios =require('axios')
const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');
const InstaClient = new Insta();
const router = express.Router();
const instagramdb=require('../../models/instagram')
const instagramCommentDb=require('../../models/instagramcommentschema')


router.get('/instagram/tags/:documentId/status',async (req,res)=>{


    let documenID=req.params.tag;
    let data;
    try{
      data =await instagramdb.findById(documenID);
      if(data.status==1){
        res.send({status:data.status,result:data,error:""})
      }
      else{
        res.send({status:data.status,result:data,error:""})
  
      }
    }
    catch(e){
      res.send({status:data.status,result:data,error:e})
  
    }
   
  
  })
  router.get('/instagram/alltags',async (req,res)=>{



    let data;
    try{
      data =await instagramdb.find({Author:req.body.username});
   
        res.send({result:data})
    }
    catch(e){
      res.send({status:-1,error:e})
  
    }
   
  
  
  })




  //COMMENTS
  router.get('/instagram/comments/:documentId/status',async (req,res)=>{


    let documenID=req.params.documentId;
    let data;
    try{
      data =await instagramdb.findById(documenID);
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


module.exports = router