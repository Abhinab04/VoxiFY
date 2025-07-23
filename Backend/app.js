const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors');
const { ensureAuthentication } = require('./config/off')
require('dotenv').config();
const app = express()
app.use(cors());
app.use(express.json())
const port = 3001;
require('./config/passport')(passport)

//mongodb connection string
const db = require('./config/key').MongoURI;

//mongodb connection
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log("mongodb connect")
    })
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.json({ message: 'from backend to frontend' })
})

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    // cookie: { secure: process.env.ENV === 'PRODUCTION' }  production mai jab daalenge tab comment out kar denge
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', require('./Route/user'))
app.use('/audio', require('./Route/audio'))
app.use('/chat', require('./Route/chat'))

app.listen(port, () => {
    console.log(`port is listening ${port}`)
})