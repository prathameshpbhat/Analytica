const express= require('express')
const axios =require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');

const InstaClient = new Insta();
const router = express.Router();

const instagramdb=require('../../models/instagram')



router.get('/analytica/instagram/tags/:tag',isloggedin,async (req,res)=>{

  

    var tag=req.params.tag;

    try{
            
            const result=await InstaClient.getHashtagPosts(tag, 100)
            let array1=[];
      
         
           let {status,documentId}=await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-search', {
              params: {
                
                Author:req.body.user,
                foo: result
              },
          
            })
         
            
            res.send({status,documentId})
          }
          catch(e){
            res.send(e)
          }
        }
      
)



  router.get('/instagram/real/tags/:tag',async (req,res)=>{

 
    var tag=req.params.tag;
    console.log(tag)
    try{
            
            const result=await InstaClient.getHashtag(tag)
      
         
            
            res.status(202).send(result)
          }
          catch(e){
            res.send(e)
          }
        }
  
)

router.get('/instagram/comments/:id',async (req,res)=>{
    try{
        let tag=req.params.id;
        
        let result=await InstaClient.getPostComments(tag, 100);
      
        let {status,documentId}= await axios.post('https://sentiment-analysis-micro.herokuapp.com/insta-comment', {
            params: {
              foo: result
            }
          })
  
          res.status(202).send({status,documentId})

    }
    catch(e){
        res.send(e)

    }
})





module.exports=router;