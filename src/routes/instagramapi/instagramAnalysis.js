const express = require('express')
const axios = require('axios')



const Insta = require('scraper-instagram');
const isloggedin = require('../../middleware/isloggedin');

const InstaClient = new Insta();
const router = express.Router();

const instagramdb = require('../../models/instagram')
const instagramAnalytics = require('instagram-analytics');


router.get('/analytica/analysis/profile/:id', async (req, res) => {
    let username=req.params.id;
    //changes with  instagram-analytics
    // try{
        let analysedDetails= await instagramAnalytics(username)
        res.status(200).send({
            details:analysedDetails
        })
    // }
    // catch(e){
    //     res.send({
    //         'error':e
    //     })
    // }



})



module.exports = router;