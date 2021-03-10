const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt=require('jsonwebtoken')

const InstagramSchema  = mongoose.Schema({
   
    Author:{
      
      
            type:mongoose.Schema.Types.ObjectId,
            
   
       
    },
    shortcode:{
        type:String,
    },
    status: {
        type: Number,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    results: {
        type: Array,
    },
    count: {
        type: Number
    }
}, {
    timestamps: true
})



const Instagram=mongoose.model('insta_searches',InstagramSchema)
module.exports = Instagram