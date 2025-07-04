const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../models/Users')
require('../config/passport')(passport)


router.post('/Register', (req, res) => {
    try {
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
            User.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            }) //finding id user exist or not and checking email exist or not
                .then(user => {
                    if (user) {
                        if (user.username === username) {
                            error.push({ msg: 'username already exist' })
                            return res.json({ success: 'false', msg: 're render the page', error })
                        }
                        if (user.email === email) {
                            error.push({ msg: 'email already exist' })
                            return res.json({ success: 'false', msg: 're render the page', error })
                        }
                    }
                    else {
                        const newuser = new User({
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
    } catch (error) {
        console.log(error);
    }
})


router.post('/Login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication Error:', err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "User not registered or incorrect credentials" });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error('Login Error:', err);
                return res.status(500).json({ success: false, message: "Login error" });
            }

            // If login succeeds
            return res.status(200).json({ success: true, message: "Login successful, redirect to dashboard" });
        });
    })(req, res, next);
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