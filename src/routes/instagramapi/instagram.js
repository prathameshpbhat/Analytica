const express = require('express')
const axios = require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');

const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require('../../models/instagram')
const instagramAnalytics = require('instagram-analytics');


router.post('/analytica/instagram/search/:tag', async (req, res) => {
  var tag = req.params.tag;

  try {

    const result = await InstaClient.getHashtagPosts(tag, 100)
    let array1 = [];
    console.log(req.body.user);

    let response = await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-search', {


      Author: req.body.user,
      results: result,
      query: tag


    })
    console.log(response.data)

    res.status(202).json({
      "status": response.data.status,
      "documentId": response.data.documentId
    })
  } catch (e) {
    res.send(e)
  }
})

router.get('/analytica/instagram/real/tags/:tag', async (req, res) => {



    var tag = req.params.tag;
    console.log(tag)
    try {

      const result = await InstaClient.getHashtag(tag)



      res.status(202).send(result)
    } catch (e) {
      res.send(e)
    }
  }

)

router.post('/analytica/instagram/comments/:id', isloggedin, async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: "user not authorised"
    });
  }

  try {
    let tag = req.params.id;

    let result = await InstaClient.getPostComments(tag, 100);

    let response = await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-comment', {

      Author: req.body.user,
      results: result,

      shortcode: tag

    })

    res.status(202).send({
      "status": response.data.status,
      "documentId": response.data.documentId
    })

  } catch (e) {
    res.send(e)

  }
})


router.get('/analytica/instagram/real/comments/:id', async (req, res) => {



    var tag = req.params.id;
    console.log(tag)
    try {

      const result = await InstaClient.getPostComments(tag, 100)



      res.status(202).send(result)
    } catch (e) {
      res.send(e)
    }
  }

)


router.get('/analytica/instagram/profile/:id',async(req,res)=>{
  try{
    let username=req.params.id;
    let profile= await InstaClient.getProfile(username);
  }
  catch(e){
    res.status(400).send({
      'error':e,
    })
  }

})



module.exports = router;