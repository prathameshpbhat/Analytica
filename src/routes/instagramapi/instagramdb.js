const express = require('express')
const axios = require('axios')
const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');
const InstaClient = new Insta();
const router = express.Router();
const instagramdb = require('../../models/instagram')
const instagramCommentDb = require('../../models/instagramcommentschema')
const isAuth = require("../../middleware/auth");

router.post('/analytica/instagram/tags/:documentId/status', isloggedin, async (req, res) => {

  if (!req.token) {
    return res.status(401).send({
      error: "user not authorised"
    });
  }

  let documenID = req.params.documentId;
  console.log(documenID)
  let data;
  try {
    data = await instagramdb.findById(documenID);
    console.log(data)
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
      search.results.forEach(el => {
        if (el.sentiment == "Positive") {
          positiveArray.push(el);
        } else if (el.sentiment == "Negative") {
          negativeArray.push(el);
        }
      })

      return res.status(200).json({
        positives: positiveArray,
        numberOfPositives: positiveArray.length,
        negatives: negativeArray,
        numberOfNegatives: negativeArray.length
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
  // try{
    console.log(req.user.Email)
    const result=await instagramdb.find({'author':req.user.Email,status:1}).sort({'created_at':-1}).limit(5)
    let submission=result
    let finalSubmmission=[];
  // return  res.status(200).json(result[0])
    result.forEach((el)=>{
      let positiveArray=[],negativeArray=[],neutralArray=[]
      let eachElement={
          Querry:el.query,
          Positives:[],
          Negatives:[],
          Neutral:[],
          Time:el.updatedAt
      }
      console.log('stage1 allDownload')
        el.results.forEach((al)=>{
          console.log('stage2 allDownload')
          let eachCaptionResukt={
            Caption:al.caption,
            Sentiment:al.sentiment
          }
          if(al.sentiment==="Positive"){
            positiveArray.push(eachCaptionResukt)
          }
          else if(al.sentiment==="Negative"){
            negativeArray.push(eachCaptionResukt)
          }
          else{
            neutralArray.push(eachCaptionResukt)
          }
        })
        if(positiveArray.length>0)
        eachElement.positives.push(positiveArray)
        if(negativeArray.length>0)
        eachElement.negatives.push(negativeArray)
        if(neutralArray.length>0)
        eachElement.Neutral.push(neutralArray)

console.log("check eachelelemt"+eachElement)
        finalSubmmission.push(eachElement)

    })

    res.status(200).json(finalSubmmission)
  // }
// catch(e){
//   res.send(e.status).json({
//     Error:e.toString(),
//   })
// }
})


router.get('/analytica/instagram/alltags', isloggedin, async (req, res) => {

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
router.get('/analytica/instagram/comments/:documentId/status', isloggedin, async (req, res) => {

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