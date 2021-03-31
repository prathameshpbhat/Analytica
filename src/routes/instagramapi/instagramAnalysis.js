const express = require('express')
const axios = require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');

const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require('../../models/instagram')


router.get('/analytica/analysis/profile/engagement/:id', async (req, res) => {
    let username=req.params.id;
 
        let userProfile=await InstaClient.getProfile(username)
        let likes=0,comments=0,followers=0,posts=0;
        posts=userProfile.posts;
        followers=userProfile.followers
        let freq=0;
        let lastpost
        let postdates=[]
        let postLikes=[]

        userProfile.lastPosts.forEach((e,i)=>{
            likes+=e.likes,
            comments+=e.comments
      
          var theDate = new Date(e.timestamp * 1000);
                dateString = theDate.toGMTString();
                postdates.push(dateString)
                postLikes.push(e.likes)

            if(i==0){
             lastpost=e
               
            }
            else{
                freq+=(lastpost.timestamp-e.timestamp)
               
            }
            lastpost=e


        })
        if(userProfile.lastPosts.length!=0){
            freq=1/((((freq/60)/60)/24)/userProfile.lastPosts.length)
        }
     

        
        let engagement=(((likes+comments)/posts)/followers)
        console.log(posts)
        res.status(200).json({
            engagement:engagement,
            likes:likes,
            comments:comments,
            posts:posts,
            followers:followers,
            postFrequency:freq,
            postdates:postdates,
            postLikes:postLikes,
        })




})



module.exports = router;