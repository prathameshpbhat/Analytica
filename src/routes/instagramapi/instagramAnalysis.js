const express = require("express");
const axios = require("axios");
const FileCookieStore = require("tough-cookie-filestore2");

const Insta = require("scraper-instagram");

const InstaClient = new Insta();
const router = express.Router();

const Instagram = require("instagram-web-api");
let username = process.env.username;
let password = process.env.password;

// router.get('/analytica/analysis/profile/engagement/:id', async (req, res) => {
//     let username=req.params.id;

//     // try{

//       let userProfile=await InstaClient.getProfile(username)
//         let likes=0,comments=0,followers=0,posts=0;
//         posts=userProfile.posts;
//         followers=userProfile.followers
//         let freq=0;
//         let lastpost
//         let postdates=[]
//         let postLikes=[]

//         userProfile.lastPosts.forEach((e,i)=>{
//             likes+=e.likes,
//             comments+=e.comments

//           var theDate = new Date(e.timestamp * 1000);
//                 dateString = theDate.toGMTString();
//                 postdates.push(dateString)
//                 postLikes.push(e.likes)

//             if(i==0){
//              lastpost=e

//             }
//             else{
//                 freq+=(lastpost.timestamp-e.timestamp)

//             }
//             lastpost=e

//         })
//         if(userProfile.lastPosts.length!=0){
//             freq=1/((((freq/60)/60)/24)/userProfile.lastPosts.length)
//         }

//         let engagement=(((likes+comments)/posts)/followers)
//         console.log(posts)
//         res.status(200).json({
//             engagement:engagement,
//             likes:likes,
//             comments:comments,
//             posts:posts,
//             followers:followers,
//             postFrequency:freq,
//             postdates:postdates,
//             postLikes:postLikes,
//         })
//     // }
//     //  catch(e){
//     //      res.status(400).send({
//     //          Error:'User noot Found|Limit reached'
//     //      })
//     //  }

// })
router.post("/analytica/analysis/profile/engagement/:id", async (req, res) => {
  username = "gowithbang2";

  try {
    const client = new Instagram({ username, password });
    console.log(username + "  " + password);
    await client.login();
    const instagram = await client.getUserByUsername({
      username: req.params.id,
    });
    // const me = await client.getUserByUsername({ username: client.credentials.username })
    let likes = 0,
      comments = 0,
      followers = 0,
      posts = 0;
    posts = instagram.edge_owner_to_timeline_media.count;
    followers = instagram.edge_followed_by.count;
    let freq = 0;
    let lastpost;
    let postdates = [];
    let postLikes = [];

    instagram.edge_owner_to_timeline_media.edges.forEach((e, i) => {
      (likes += e.node.edge_liked_by.count),
        (comments += e.node.edge_media_to_comment.count);

      var theDate = new Date(e.node.taken_at_timestamp * 1000);
      dateString = theDate.toGMTString();
      postdates.push(dateString);
      postLikes.push(e.node.edge_liked_by.count);

      if (i == 0) {
        lastpost = e;
      } else {
        freq += lastpost.node.taken_at_timestamp - e.node.taken_at_timestamp;
      }
      lastpost = e;
    });
    if (instagram.edge_owner_to_timeline_media.edges.length != 0) {
      freq =
        1 /
        (freq /
          60 /
          60 /
          24 /
          instagram.edge_owner_to_timeline_media.edges.length);
    }

    let engagement = (likes + comments) / posts / followers;
    console.log(posts);
    res.status(200).json({
      engagement: engagement,
      likes: likes,
      comments: comments,
      posts: posts,
      followers: followers,
      postFrequency: freq,
      postdates: postdates,
      postLikes: postLikes,
    });
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
router.post('/analytica/analysis/profile/getactivity',async (req,res)=>{
  try{

  
  username ="gowithbang2"
  const client = new Instagram({ username, password })
  await client.login()
  const activity = await client.getActivity()
  res.status(200).json(activity)
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


// router.post('/analytica/analysis/profile/getactivity',async (req,res)=>{

//     const client = new Instagram({ username, password })
//     await client.login()
//     const activity = await client.getActivity()
//     res.status(200).json(activity)

//   })

router.post(
  "/analytica/analysis/profile/getsimilarcharacters/:id",
  async (req, res) => {
    username = "gowithbang2";
    const client = new Instagram({ username, password });
    await client.login();
    const instagram = await client.getUserByUsername({
      username: req.params.id,
    });

    let userId = instagram.id;
    console.log("here" + userId);

    const result = await client.getChainsData({ userId });
    // const activity = await client.getActivity()
    res.status(200).json(result);
  }
);
// router.get('/checker/analytica/analysis/profile/engagement/:id', async (req,res)=>{

//   let username="gowithbang2"
//   const client = new Instagram({ username, password })
//   console.log(username+"  "+password)
//   await client.login()
//     const profile = await client.getProfile()
//     console.log(profile)

// res.send(profile)

// })

module.exports = router;
