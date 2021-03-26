const USER=require('../models/users')
const express=require('express')
const auth=require('../middleware/auth')

const route=express.Router();

route.post('/Analytica/users/Register',async (req,res)=>{

 
   
     
        try{
            const user=new USER(req.body)
            const token=await user.generateAuthTokens()
            user.tokens=user.tokens.concat({token});
            
            await user.save()
       
        req.token=token;
            res.status(200).json({
                status:'success',
                Username:req.body.Email,
                'token':token
            })
        }
        catch(e){
            console.log(e)
            res.status(400).json({
                Error:'User with Id Already exits'
            })
        }
     
        
    
     
})

route.get('/Analytica/users/Login',async (req,res)=>{
    try{
        const user=await USER.FindUserByCredential(req.body.Email,req.body.Password)
       
        const token=await user.generateAuthTokens()
        user.tokens=user.tokens.concat({token});

  
        await user.save()
        res.status(200).json({
            Username:req.body.Email,
            'token':token
        })

    }
    catch(e){
        res.status(400).json({
            status:e
        })
    }
})


route.post('/Analytica/users/Logout',auth,async (req,res)=>{
    try{
// console.log("req.token"+req.token)

        req.user.tokens=req.user.tokens.filter((token)=>{
            if(token.token!==req.token){
                return true
               
            }
           
            return false
        })

        await req.user.save();
        res.status(200).json({
            status:'success'
        })

    }
    catch(e){
        res.status(500).json({
            status:'Something went wrong'
        })
    }

})
module.exports=route