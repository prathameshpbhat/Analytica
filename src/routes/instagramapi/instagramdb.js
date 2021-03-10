const express= require('express')
const axios =require('axios')
const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');
const InstaClient = new Insta();
const router = express.Router();
const instagramdb=require('../../models/instagram')
const instagramCommentDb=require('../../models/instagramcommentschema')


router.post('/instagram/tags/:documentId/status',isloggedin,async (req,res)=>{

  if (!req.token) {
    return res.status(401).send({
        error: "user not authorised"
    });
}

    let documenID=req.params.documentId;
    console.log(documenID)
    let data;
    try{
      data =await instagramdb.findById(documenID);
      console.log(data)
      if(data.status==1){
        res.send({status:data.status,result:data,error:""})
      }
      else{
        res.send({status:data.status,result:data,error:""})
  
      }
    }
    catch(e){
      res.send({error:e})
  
    }
   
  
  })
  router.get('/instagram/alltags',isloggedin,async (req,res)=>{

    if (!req.token) {
      return res.status(401).send({
          error: "user not authorised"
      });
  }


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
  router.get('/instagram/comments/:documentId/status',isloggedin,async (req,res)=>{

    if (!req.token) {
      return res.status(401).send({
          error: "user not authorised"
      });
  }

    let documenID=req.params.documentId;
    let data;
    try{
      data =await instagramdb.findById(documenID);
      console.log(data)
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