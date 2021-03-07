const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt=require('jsonwebtoken')

const InstagramCommentSchema  = mongoose.Schema({
   
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

    results: {
        type: Array,
    },
    count: {
        type: Number
    }
}, {
    timestamps: true
})

module.exports = InstagramCommentSchema