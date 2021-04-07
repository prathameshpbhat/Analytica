const USER = require("../models/users");
const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const route = express.Router();
const User = require("../models/users");
const Nodemailer =require('../email/newemail/sendNewRegistrationEmail')
const isAuth = require("../middleware/auth");
const resetPasswordMail =require('../email/resetPassword/resetPassword')
const url='https://analytica-parsb-api.herokuapp.com'
const urlFrontEnd='analytica-front.herokuapp.com'
route.post("/Analytica/users/Register", async (req, res) => {
  try {
   
    const user = new USER(req.body);
    const token = await user.generateAuthTokens();
    user.tokens = user.tokens.concat({ token });

    await user.save();
    Nodemailer(req.body.Email)
    req.token = token;
    res.status(200).json({
      status: "success",
      Username: req.body.Email,
      token: token,
    });
  } catch (e) {
    console.log(req.body.Email);
    console.log(e);
    res.status(400).json({
      Error: "User with Id Already exits",
    });
  }
});

route.post("/Analytica/users/changePassword", isAuth,async (req, res) => {
  try {
  //  User.findByIdAndDelete(req.user._id)
 req.user.Password=req.body.Password
    await req.user.save();
   
  
    res.status(200).json({
      status: "success",
  
    });
  } catch (e) {
    console.log(req.body.Email);
    console.log(e);
    res.status(400).json({
      Error: "User with Id Already exits",
    });
  }
});

route.post("/Analytica/users/Login", async (req, res) => {
  try {
    const user = await USER.FindUserByCredential(
      req.body.Email,
      req.body.Password
    );

    const token = await user.generateAuthTokens();
    user.tokens = user.tokens.concat({
      token,
    });

    await user.save();
    res.status(200).json({
      Username: req.body.Email,
      token: token,
    });
  } catch (e) {
    res.status(400).json({
      status: e,
    });
  }
});

route.post("/Analytica/users/Logout", auth, async (req, res) => {
  try {
    // console.log("req.token"+req.token)

    req.user.tokens = req.user.tokens.filter((token) => {
      if (token.token !== req.token) {
        return true;
      }

      return false;
    });

    await req.user.save();
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json({
      status: "Something went wrong",
    });
  }
});


route.get("/Analytica/users/checkexists", async (req, res) => {
  try {
    console.log("chechexits stage1")
    const token = req.header("Authorization").replace("Bearer ", "");
   
    const decoded = await jwt.verify(token, process.env.JWTTOKEN);
    console.log("chechexits stage2")
    const user = await User.findOne({
      _id: decoded,
      "tokens.token": token,
    });
    console.log("chechexits stage3")
    if (!user) {
      return res.status(401).json({
        status: "Authenticate User",
      });
    }
    console.log("chechexits stage4")
    return res.status(200).json({
      status: "Authenticate User",
    });
  } catch (e) {
    return res.status(401).json({
      status: "Authenticate User",
    });
  }
});
//generate randome number before deleting

route.get("/Analytica/users/ForgotPasswordOne/:Email",async (req, res) => {
  let Email=req.params.Email
  console.log(Email)
  try{
    let user=await User.findOne({Email:Email})
   
    if(!user){
      return res.status(404).json({
        Error:'User not found!'
      })
    }
 
    let random=Math.floor(Math.random()*1000000000000)

    
    user.ForgotPassword=random;

await user.save();

resetPasswordMail(Email,urlFrontEnd+'/Analytica/users/ForgotPasswordTwo/'+random)

    res.status(200).json({
      Status:"success",
 
    })
  }
  catch(e){
res.status(400).json({
  Error:e.toString()
})
  }

 
});
route.post("/Analytica/users/ForgotPasswordTwo/:id",async (req, res) => {
let id= req.params.id;
try{
  let user=await User.findOne({ForgotPassword:id})
  
  if(!user){
    return res.status(404).json({
      Error:'User not found'
    })
  }
  let datum = Date.parse(user.updatedAt);
  datum=  datum/1000;
  let currentDate=new Date()
   currentDate = Date.parse(currentDate);
  currentDate=  currentDate/1000;

  if(currentDate-datum>(60*60)){
    return res.status(404).json({
      Error : "link has Expired"
    })
  }
  user.Password=req.body.Password;
  user.save();
  res.status(200).json({
    status:'Success'
  })
}
catch(e){
  if(e.statusCode){
    return res.status(e.statusCode).json({
      Error:e
    })
  }
  return res.status(400).json({
    Error:e
  })
  

}
 
});

module.exports = route;
