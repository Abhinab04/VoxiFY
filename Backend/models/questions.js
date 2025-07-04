const mongoose = require('mongoose')

const Questions = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
})


module.exports = mongoose.model('allQues', Questions);