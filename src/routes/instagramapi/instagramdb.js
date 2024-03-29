const express = require('express')
const axios = require('axios')
const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');
const InstaClient = new Insta();
const router = express.Router();
const instagramdb = require('../../models/instagram')
const instagramCommentDb = require('../../models/instagramcommentschema')
const isAuth = require("../../middleware/auth");

router.get('/analytica/instagram/tags/:documentId/status', isAuth, async (req, res) => {


  let documenID = req.params.documentId;
  console.log("check datahere"+documenID)
  let data;
  try {
    console.log(documenID)
    data = await instagramdb.findById(documenID);
 
    if (data.status == 1) {
      return res.status(200).json({
        "status": "The response is ready."
      });
    } else {
      return res.status(204).send();
    }
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

router.get('/analytica/instagram/tags/:documentId/download' ,isAuth,async (req, res) => {
  instagramdb.findById(req.params.documentId).then(search => {
    if (search) {
      let positiveArray = [];
      let negativeArray = [];
      let neutralsArray = [];
      search.results.forEach(el => {
        if (el.sentiment == "Positive") {
          positiveArray.push(el);
        } else if (el.sentiment == "Negative") {
          negativeArray.push(el);
        }
        else if (el.sentiment == "Neutral") {
          neutralsArray.push(el);
        }
        
      })

      return res.status(200).json({
        positives: positiveArray,
        numberOfPositives: positiveArray.length,
        negatives: negativeArray,
        neutrals:neutralsArray,
        numberOfNegatives: negativeArray.length,
        numberOfNeutrals: neutralsArray.length
      })
    } else {
      return res.status(404).json({
        error: "Search not made"
      })
    }
  }).catch(err => {
    return res.status(500).json({
      error: err.toString()
    })
  })
})

router.get('/analytica/instagram/All/tags/download', isAuth,async (req, res) => {
  try{
    console.log(req.user.Email)
    const result=await instagramdb.find({'author':req.user.Email,status:1}).sort({createdAt:-1}).limit(5)
    // let submission=result
    // let finalSubmmission=[];
  return  res.status(200).json(result)
    // result.forEach((el)=>{
    //   console.log('stage1 allDownload')
    //   let positiveArray=[],negativeArray=[],neutralArray=[]
    //   let eachElement={
    //       Querry:el.query,
    //       Positives:[],
    //       Negatives:[],
    //       Neutral:[],
    //       Time:el.updatedAt
    //   }
     
    //     el.results.forEach((al)=>{
    //       console.log('stage2 allDownload')
    //       let eachCaptionResukt={
    //         Caption:al.caption,
    //         Sentiment:al.sentiment
    //       }
    //       if(al.sentiment==="Positive"){
    //         eachElement.positives.push(eachCaptionResukt)
    //       }
    //       else if(al.sentiment==="Negative"){
    //         eachElement.negativeArray.push(eachCaptionResukt)
         
    //       }
    //       else{
    //         eachElement.neutralArray.push(eachCaptionResukt)
          
    //       }
    //     })

    //     finalSubmmission.push(eachElement)

    // })

    // res.status(200).json(finalSubmmission)
  }
catch(e){
  res.send(e.status).json({
    Error:e.toString(),
  })
}
})


router.get('/analytica/instagram/alltags', isAuth,  async (req, res) => {

  if (!req.token) {
    return res.status(401).send({
      error: "user not authorised"
    });
  }


  let data;
  try {
    data = await instagramdb.find({
      Author: req.body.username
    });

    res.send({
      result: data
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




//COMMENTS
router.get('/analytica/instagram/comments/:documentId/status', isAuth,  async (req, res) => {

  if (!req.token) {
    return res.status(401).send({
      error: "user not authorised"
    });
  }

  let documenID = req.params.documentId;
  let data;
  try {
    data = await instagramdb.findById(documenID);
    console.log(data)
    if (data.status == 1) {
      res.send({
        status: data.status,
        result: data
      })
    } else {
      res.send({
        status: 0
      })

    }
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





module.exports = router