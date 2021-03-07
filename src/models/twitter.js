const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt=require('jsonwebtoken')

const twitterSchema  = mongoose.Schema({
   
    Author:{
      
      
            type:mongoose.Schema.Types.ObjectId,
            
   
       
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

module.exports = twitterSchema