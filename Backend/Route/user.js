const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const { user } = require('../models/Users')
require('../config/passport')(passport)


router.post('/Register', (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.confirm

    let error = [];
    //error messages
    if (!name || !username || !email || !password || !password2) {
        error.push({ msg: "Please fill all the blanks" })
    }
    if (password != password2) {
        error.push({ msg: "Password mismatch" })
    }

    if (password.length < 6) {
        error.push({ msg: "Password is too short" });
    }

    if (error.length > 0) {
        return res.json({ success: 'false', msg: "re render the register", error })
    }
    else {
        user.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        }) //finding id user exist or not and checking email exist or not
            .then(users => {
                if (users) {
                    if (users.username === username) {
                        error.push({ msg: 'username already exist' })
                        return res.json({ success: 'false', msg: 're render the page', error })
                    }
                    if (users.email === email) {
                        error.push({ msg: 'email already exist' })
                        return res.json({ success: 'false', msg: 're render the page', error })
                    }
                }
                else {
                    const newuser = new user({
                        name,
                        username,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newuser.password, salt, function (err, hash) {
                            newuser.password = hash;


                            //save user

                            newuser.save()
                                .then(user => {
                                    return res.json({ success: 'true', message: "redirect to login" })
                                })
                                .catch(err => console.log(err))
                        })
                    })

                }
            })
    }
})


router.post('/Login', async (req, res) => {
    console.log('into login')
    try {
        const { email, password } = req.body;
        let error = []
        if (!email || !password) {
            error.push({ msg: "Please fill all the credentials" })
        }
        const exist = await user.findOne({ email });
        console.log(exist);
        if (!exist) {
            error.push({ msg: "User not found please Signup" })
        }
        const ismatch = await bcrypt.compare(password, exist.password);
        if (!ismatch) {
            error.push({ msg: "password or email doesnt match" })
        }

        if (error.length > 0) {
            return res.json({ success: 'false', msg: "re render the login", error })
        }

        const token = jwt.sign({ email: exist.email, id: exist._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "login successfull",
            name: exist.username,
            email: exist.email
        });
        console.log('login done')
    } catch (error) {
        console.log('Internal Server Error' + error);
    }
});


router.get('/Logout', (req, res) => {
    req.logout(req.user, err => {
        if (err) {
            console.log(err);
        }
    });
    return res.json({ success: 'true' })
})



module.exports = router;