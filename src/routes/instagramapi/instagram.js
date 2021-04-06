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
let username = "raunak.naik.12";
let password ="RaunakNaik99*";
// let password = process.env.password;
let client;
// (async()=>
// {
//   client = new Instagram({ username, password });
//   await client.login();

// })();
router.post("/analytica/instagram/search/:tag", isAuth,async (req, res) => {
  var tag = req.params.tag;

 console.log(client)
    try {
    let count = 0,
      rc = 0;
    username = "raunak.naik.12";
    if (client === undefined) {
        client = new Instagram({ username, password });
         await client.login();
      
     
    }

    const result = await client.getMediaFeedByHashtag({
      hashtag: tag,
      first: 150,
    });
    let array1 = [];
    result.edge_hashtag_to_media.edges.forEach((e) => {
      count++;
      if (e.node.edge_media_to_caption.edges[0]) {
        let obj = {
          caption: e.node.edge_media_to_caption.edges[0].node.text,
        };
        array1.push(obj);
      }
    });

    // rc=array1.length
    //     console.log(req.body.user);
    //     res.send({
    //       result,
    //       rc,
    //     })

    let response = await axios.post(
      "https://sentiment-analysis-micro.herokuapp.com/insta-search",
      {
        Author: req.user.Email,
        results: array1,
        query: tag,
      }
    );
    console.log(response.data);

    res.status(202).json({
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

router.get("/analytica/instagram/real/tags/:tag", isAuth, async (req, res) => {
  var tag = req.params.tag;
  console.log(tag);
 console.log(client)
    try {
    username = "raunak.naik.12";
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

router.post("/analytica/instagram/comments/:id", async (req, res) => {
 console.log(client)
    try {
    let tag = req.params.id;

    username = "raunak.naik.12";
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

router.get("/analytica/instagram/real/comments/:id", async (req, res) => {
  var tag = req.params.id;
  console.log(tag);
 console.log(client)
    try {
    username = "raunak.naik.12";
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

router.get("/analytica/instagram/profile/:id", async (req, res) => {
 console.log(client)
    try {
    username = "raunak.naik.12";
    if (client === undefined) {
      client = new Instagram({ username, password });
      await client.login();
    }
    let usernameID = req.params.id;

    console.log("here");
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
router.get("/analytica/instagram/personalprofile", async (req, res) => {
 console.log(client)
    try {
    username = "raunak.naik.12";
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
router.get( "/analytica/instagram/personalprofile/getfeeds",
  async (req, res) => {
    console.log(client)
 
    try {
      username = "raunak.naik.12";
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
router.post("/analytica/analysis/profile/getsimilarcharacters/:id",
  async (req, res) => {
    try{

   
      username = "raunak.naik.12";
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
    // const activity = await client.getActivity()
    res.status(200).json(result);
  
}
catch(e){
  res.status(400).json
}
  });



  router.get( "/Analytica/instagram/personalprofile/getfollower",
  async (req, res) => {
    console.log(client)
 
    try {
      username = "raunak.naik.12";
      if (client === undefined) {
 
        client = new Instagram({ username, password });
        await client.login();
      }
     
      const instagram = await client.getUserByUsername({
        username: username,
      });
  
      const followers = await client.getFollowers({ userId: instagram.id})
      res.status(200).json(followers);
    } catch (e) {
      if (e.status) {
        res.status(e.statusCode).json({
          error: e,
        });
        return;
      }
      res.status(e.statusCode).json({
        error: e,
      });
    }
  }
);
module.exports = router;
