const express = require('express')
const axios = require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');
const isAuth = require('../../middleware/auth');
const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require('../../models/instagram')
const instagramAnalytics = require('instagram-analytics');

const Instagram = require("instagram-web-api");
const e = require('express');
let username = "gowithbang2";;
let password = process.env.password;
let client
(async()=>
{
  client = new Instagram({ username, password });
  await client.login();

})();
router.post('/analytica/instagram/search/:tag', async (req, res) => {
  var tag = req.params.tag;

  try {
    let count=0,rc=0;
     username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
    
    const result = await client.getMediaFeedByHashtag({ hashtag: tag,first:150 })
    let array1 = [];
    result.edge_hashtag_to_media.edges.forEach((e)=>{
      count++
      if(e.node.edge_media_to_caption.edges[0]){
        let obj={
          caption:e.node.edge_media_to_caption.edges[0].node.text
        }
        array1.push(obj)
      }
  
    })
  
    
// rc=array1.length
//     console.log(req.body.user);
//     res.send({
//       result,
//       rc,
//     })

    let response = await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-search', {


      Author: req.body.user,
      results: array1,
      query: tag


    })
    console.log(response.data)

    res.status(202).json({
      "status": response.data.status,
      "documentId": response.data.documentId
    })
  }
  catch(e){
    if(e.status){
      res.status(e.status).json({
        'error':e,
      })
      return;
    }
    res.status(400).json({
      'error':e,
    })
    }
   
 
  
})

router.get('/analytica/instagram/real/tags/:tag', async (req, res) => {



    var tag = req.params.tag;
    console.log(tag)
    try {

       username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
 
      const result = await client.getMediaFeedByHashtag({ hashtag: tag,first:150 })

console.log(result)

      res.status(202).json(result)
    }
    catch(e){
      if(e.status){
        res.status(e.status).json({
          'error':e,
        })
      }
      }
     
      res.status(400).json({
        'error':e,
      })
    
  }

)

router.post('/analytica/instagram/comments/:id', async (req, res) => {

  try {
    let tag = req.params.id;

     username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
   

    const result = await client.getMediaComments({ shortcode: tag})
let array1=[]
result.edges.forEach((e)=>{
  if(e.node){
    let obj={
      content:e.node.text
    }
    array1.push(obj)
  }
})
    let response = await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-comment', {

      Author: req.body.user,
      results: array1,

      shortcode: tag

    })

    res.status(202).send({
      "status": response.data.status,
      "documentId": response.data.documentId
    })

  }
  catch(e){
    if(e.status){
      res.status(e.status).json({
        'error':e,
      })
      return;
    }
    res.status(400).json({
      'error':e,
    })
    }
  
})


router.get('/analytica/instagram/real/comments/:id', async (req, res) => {



    var tag = req.params.id;
    console.log(tag)
    try {

       username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
 
      const result = await client.getMediaComments({ shortcode: tag})



      res.status(202).send(result)
    }
    catch(e){
      if(e.status){
        res.status(e.status).json({
          'error':e,
        })
      }
      }
     
      res.status(400).json({
        'error':e,
      })
    
  }

)


router.get('/analytica/instagram/profile/:id',async(req,res)=>{
  try{
     username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
    let usernameID=req.params.id;

    console.log('here')
    let profile=await client.getUserByUsername({ username:usernameID })
    res.status(200).json(profile)
  }
  catch(e){
    if(e.status){
      res.status(e.status).json({
        'error':e,
      })
      return;
    }
    res.status(400).json({
      'error':e,
    })
    }
  

})
router.get('/analytica/instagram/personalprofile',async(req,res)=>{
  try{
     username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
    let usernameID=req.params.id;


    const profile = await client.getProfile()
    res.status(200).json(profile)
  }
  catch(e){
    if(e.status){
      res.status(e.status).json({
        'error':e,
      })
      return;
    }
    res.status(400).json({
      'error':e,
    })
    }
  


})
router.get('/analytica/instagram/personalprofile/getfeeds',async(req,res)=>{
  try{
     username = "gowithbang2";
 if(client.country_code===undefined){
   await client.login()
 }
 if(client.country_code===undefined){
   await client.login()
 }

    const feeds = await client.getHome()
    res.status(200).json(feeds)
  }
  catch(e){
    if(e.status){
      res.status(e.status).json({
        'error':e,
      })
      return;
    }
    res.status(400).json({
      'error':e,
    })
    }
  
})



module.exports = router;