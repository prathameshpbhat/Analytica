const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
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

module.exports = mongoose.model('search', searchSchema);