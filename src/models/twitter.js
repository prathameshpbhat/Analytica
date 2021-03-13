const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const twitterSchema = mongoose.Schema({
    Author: {
        type: String,
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

const Twitter = mongoose.model('twitter_searches', twitterSchema)
module.exports = Twitter