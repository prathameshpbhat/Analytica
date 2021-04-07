const express = require("express");
const axios = require("axios");

const Insta = require("scraper-instagram");
const isloggedin = require("../../middleware/isloggedin");
const isAuth = require("../../middleware/auth");
const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require("../../models/instagram");
const instagramAnalytics = require("instagram-analytics");
const twitterUserPosts=require('../../libs/twitter_user')
const Instagram = require("instagram-web-api");
const e = require("express");
const auth = require("../../middleware/auth");
const mainData=require('../../jsonFileData/json')
let username = mainData.InstagramUsername;
let password =mainData.InstagramPassword;
let client;


router.get('/Analytica/commonPosts/getPosts',async (req,res)=>{
    let array=[]
    try{
      const result= await twitterUserPosts.getPublicTweetsCommon(15506669);
      if (client === undefined) {
        client = new Instagram({ username, password });
        await client.login();
      }
 
      let finalArray=[]
      let profile = await client.getUserByUsername({ username: 'jeffbezos' });

       
        profile.edge_felix_video_timeline.edges.forEach((el)=>{
            let obj={
                caption:'',
                likeCount:0,
                commentCount:0,
                timeStamp:0,
                sMedia:''
            }
            if(el.node.edge_media_to_caption.edges.length>0){
                obj.caption=el.node.edge_media_to_caption.edges[0].node.text;
                obj.commentCount=el.node.edge_media_to_comment.count,
                obj.likeCount=el.node.edge_liked_by.count,
                obj.timeStamp=el.node.taken_at_timestamp
               obj.sMedia='Instagram'

            }
            else{
                obj.caption="No Caption"
                obj.commentCount=el.node.edge_media_to_comment.count,
                obj.likeCount=el.node.edge_liked_by.count,
                obj.timeStamp=el.node.taken_at_timestamp
               obj.sMedia='Instagram'
            }
          
            finalArray.push(obj)
            
        })
        let ultmateArray=[...result,...finalArray];

    
        ultmateArray.sort((function(a,b){
            return a.timeStamp-b.timeStamp;
        }));
      res.status(200).json(ultmateArray)
    }
    catch(e){
      if(e.statusCode){
        res.status(e.statusCode).json({'Error':e})
      }
      res.status(403).json({'Error':e})

    }
})

module.exports = router;
