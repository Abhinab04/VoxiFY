const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    issue: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('allIssue', IssueSchema);