const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const InstagramCommentSchema = mongoose.Schema({
    Author: {
        type: String,
    },
    shortcode: {
        type: String,
    },
    status: {
        type: Number,
        required: true
    },

    results: {
        type: Array,
    },

}, {
    timestamps: true
})
const Instagram = mongoose.model('insta_comments', InstagramCommentSchema)
module.exports = InstagramCommentSchema