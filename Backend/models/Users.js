const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const QuizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

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

const IssueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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


const user = mongoose.model('text_to_speech', UserSchema)
const quiz = mongoose.model('Text_to_speech_quiz', QuizSchema)
const Question = mongoose.model('allQues', Questions);
const Issue = mongoose.model('allissue', IssueSchema)

module.exports = {
    user,
    quiz,
    Question,
    Issue
}