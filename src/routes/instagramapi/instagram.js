const express = require("express");
const axios = require("axios");

const Insta = require("scraper-instagram");
const isloggedin = require("../../middleware/isloggedin");
const isAuth = require("../../middleware/auth");
const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require("../../models/instagram");
const instagramAnalytics = require("instagram-analytics");

const Instagram = require("instagram-web-api");
const e = require("express");
const auth = require("../../middleware/auth");
const mainData=require('../../jsonFileData/json')
const instaUpoad=require('../../middleware/instagram_upload')
const path=require('path')
let username =mainData.InstagramUsername;
let password =mainData.InstagramPassword;
let rapidAPIUrlxrapidapikey=mainData.rapidAPIUrlxrapidapikey2
let xrapidapihost=mainData.xrapidapihost2
//let password = process.env.password;
const redirectUri = 'https://analytica-front.herokuapp.com/Dashboard';

const InstagramGraphApi =require('node-instagram').default;
const instagramGraphApi = new InstagramGraphApi({
  clientId: '527692674858952',
  clientSecret: '53c3e4f2417c272e83e45fb36430240a',
  accessToken: 'IGQVJYRjRaeF8tR2ZALaTRSajhVWlF0SnNIZA19PX1JMSE5LczdoRFZAOWmZAINmwyZAmVQSVZA4M19PYndKZA1NFSFRZAOVJwOExhQU5xUUlPWU1yUWRwV1lFRDJIdGxzamstbzBrS1NVSC1KX1NsWTZAPbXN0ZAgZDZD',
});
 

let client;
// (async()=>
// {
//   client = new Instagram({ username, password });
//   await client.login();

// })();
router.post("/analytica/instagram/search/:tag", isAuth,async (req, res) => {
  var tag = req.params.tag;

//  console.log(client,username,password)
    try {
    let count = 0,
      rc = 0;

    // if (client === undefined) {
    //     client = new Instagram({ username, password });
    //      await client.login();
      
     
    // }
    console.log("stage1")
    var axios = require("axios").default;
tag=tag.replace(/\s/g, "");

    var options = {
      method: 'GET',
      url: 'https://instagram-data1.p.rapidapi.com/hashtag/feed',
      params: {hashtag: tag},
      headers: {
        'x-rapidapi-key': rapidAPIUrlxrapidapikey,
        'x-rapidapi-host': xrapidapihost
      }
    };
    let response_uncleaned
    try{
      response_uncleaned=  await axios.request(options)
    }
catch(e){
     return res.status(400).json({
      error: e,
    });
}
let result=response_uncleaned.data
    // const result = await client.getMediaFeedByHashtag({
    //   hashtag: tag,
    //   first: 150,
    // });
    let array1 = [];
    result.collector.forEach((e) => {
      count++;
      
        let obj = {
          caption: e.description,
          commentCount:e.comments,
          likeCount:e.likes,
          timeStamp:e.taken_at_timestamp*1000,
        }
        array1.push(obj);
      }
    );
    rc=array1.length
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response = await axios.post(
    mainData.urlAws+'/insta-search',
   
      {
        Author: req.user.Email,
        results: array1,
        query: tag,
        
      }
      ,config
      
    );
    console.log(response.data);
    console.log("stage3")
    res.status(202).json({
      status: response.data.status,
      documentId: response.data.documentId,
    });
  } catch (e) {
    if (e.status) {
    return  res.status(e.status).json({
        error: e,
      });
      return;
    }
  return  res.status(400).json({
      error: e,
    });
  }
});

router.get("/analytica/instagram/real/tags/:tag", isAuth, async (req, res) => {
  var tag = req.params.tag;
  console.log(tag);
 console.log(client)
    try {
 
    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }

    const result = await client.getMediaFeedByHashtag({
      hashtag: tag,
      first: 150,
    });

    console.log(result);

    res.status(202).json(result);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({
        error: e,
      });
    }
    return;
  }

  res.status(400).json({
    error: e,
  });
});

router.post("/analytica/instagram/comments/:id", isAuth, async (req, res) => {
 console.log(client)
    try {
    let tag = req.params.id;


    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }

    const result = await client.getMediaComments({ shortcode: tag });
    let array1 = [];
    result.edges.forEach((e) => {
      if (e.node) {
        let obj = {
          content: e.node.text,
        };
        array1.push(obj);
      }
    });
    let response = await axios.post(
      "https://sentiment-analysis-micro.herokuapp.com/insta-comment",
      {
        Author: req.body.user,
        results: array1,

        shortcode: tag,
      }
    );

    res.status(202).send({
      status: response.data.status,
      documentId: response.data.documentId,
    });
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({
        error: e,
      });
      return;
    }
    res.status(400).json({
      error: e,
    });
  }
});

router.get("/analytica/instagram/real/comments/:id", isAuth, async (req, res) => {
  var tag = req.params.id;
  console.log(tag);
 console.log(client)
    try {
   
    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }

    const result = await client.getMediaComments({ shortcode: tag });

    res.status(202).send(result);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({
        error: e,
      });
      return;
    }

    res.status(400).json({
      error: e,
    });
  }
});

router.get("/analytica/instagram/profile/:id", isAuth,async (req, res) => {
 console.log(client)
    try {

    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }
    let usernameID = req.params.id;

  
    let profile = await client.getUserByUsername({ username: usernameID });
    res.status(200).json(profile);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({
        error: e,
      });
      return;
    }
    res.status(400).json({
      error: e,
    });
  }
});
router.get("/analytica/instagram/personalprofile", isAuth, async (req, res) => {
 console.log(client)
    try {

    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }
    let usernameID = req.params.id;

    const profile = await client.getProfile();
    console.log(profile)
    res.status(200).json(profile);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({
        error: e,
      });
      return;
    }
    res.status(400).json({
      error: e,
    });
  }
});
router.get( "/analytica/instagram/personalprofile/getfeeds", isAuth,
  async (req, res) => {
    console.log(client)
 
    try {
      if (client === undefined) {
 
        client = new Instagram({ username, password });
        await client.login();
      }
     

      const feeds = await client.getHome();
      res.status(200).json(feeds);
    } catch (e) {
      if (e.status) {
        res.status(e.status).json({
          error: e,
        });
        return;
      }
      res.status(400).json({
        error: e,
      });
    }
  }
);
router.get("/analytica/analysis/profile/getsimilarcharacters/:id", isAuth,
  async (req, res) => {
    try{

   
  
      if (client === undefined) {
        client = new Instagram({ username, password });
        await client.login();
      }
     
    const instagram = await client.getUserByUsername({
      username: req.params.id,
    });

    let userId = instagram.id;
    console.log("here" + userId);

    const result = await client.getChainsData({ userId });
    let newArraylength5=[];
    let dataNumber=0;
    // result.forEach((el)=>{
    //   if(dataNumber===4){
    //     break;
    //   }
    //   dataNumber++;
    //   newArraylength5.push(el)
    // })

    for(let i=0;i<Math.min(result.length,5);i++){
      let image = await axios.get( result[i].profile_pic_url, {responseType: 'arraybuffer'});
      let raw = Buffer.from(image.data).toString('base64');
      let profile_pic="data:" + image.headers["content-type"] + ";base64,"+raw;
      result[i].profile_pic_url=profile_pic
      newArraylength5.push(result[i])
    }
    let image = await axios.get(instagram.profile_pic_url, {responseType: 'arraybuffer'});
    let raw = Buffer.from(image.data).toString('base64');
    let profile_pic="data:" + image.headers["content-type"] + ";base64,"+raw;
    console.log("profilepic:"+newArraylength5)

    res.status(200).json({profilePic:profile_pic ,chainedData:newArraylength5});
  
}
catch(e){
  res.status(400).json
}
  });



  router.get( "/Analytica/instagram/personalprofile/getfollowers", isAuth,
  async (req, res) => {
    console.log(client)
 
    try {
  
      if (client === undefined) {
 
        client = new Instagram({ username, password });
        await client.login();
      }
     console.log("stage2")
      const instagram = await client.getUserByUsername({
        username: "jeffbezos",
      });
      console.log("stage3")
      const followers = await client.getFollowers({ userId: instagram.id})
      console.log("stage4")
    followers.data.forEach(async (el)=>{
        let image = await axios.get( el.profile_pic_url, {responseType: 'arraybuffer'});
        let raw = Buffer.from(image.data).toString('base64');
        let profile_pic="data:" + image.headers["content-type"] + ";base64,"+raw;
        el.profile_pic_url=profile_pic
      })
      res.status(200).json(followers);
    } catch (e) {
      // if (e.status) {
      //   res.status(e.status).json({
      //     error: e,
      //   });
      //   return;
      // }
      res.status(400).json({
        error: e,
      });
    }
  }
);

router.post('/Analytica/instagram/InstgarmPost',instaUpoad.single('file'),async (req,res)=>{
  let  dirPath=path.join(__dirname,'../../../my-uploads/')
  const photo = dirPath+req.file.filename
let caption=req.body.status
console.log(caption)
console.log(photo)
console.log( req.file)

try{
  if (client === undefined) {
 
    client = new Instagram({ username, password });
    await client.login();
  }
  console.log("stage1")
  if(photo==""||photo==null||photo==undefined){
    photo='https://images.unsplash.com/photo-1622915984758-e4ac40643c39?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
  }
  console.log("stage2")
  const { media }= await client.uploadPhoto({ photo:photo, caption: caption, post: 'feed' })
  console.log("stage3")
    res.status(200).json({
      msg:"success",
      data:`https://www.instagram.com/p/${media.code}/`
    })
}
catch(e){
  console.log("stage4")
  res.status(400).json({
    msg:e
  })
}
// res.status(200).json({
//   msg:"success"
// })
})

router.get('/auth/instagram',async (req, res) => {

});

// // Handle auth code and get access_token for user
// router.get('/auth/instagram/callback', async (req, res) => {
//   try {
//     const data = await instagramGraphApi.authorizeUser(req.query.code, redirectUri);
//     // access_token in data.access_token
//     res.json(data);
//   } catch (err) {
//     res.json(err);
//   }
// });

// instagram.get('users/self', (err, data) => {
//   console.log(data);
// });
module.exports = router;
