const express = require('express')
require('dotenv').config()
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const app = express()
const User = require('./db')

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((user, cb) => {
    cb(null, user)
})

passport.use(new Strategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:8000/auth/google/redirect",
    profileFields: ['id', 'displayName']
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile, 'test')
        User.findOne({ 'id': profile.id }, function (err, user) {
            if (err)
                return done(err);
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user);
            } else {
                var newUser = new User({
                    id: profile.id,
                    displayName: profile.displayName
                });
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }
))

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

app.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: "/auth/fail" }), (req, res, next) => {
    console.log(req.user, req.isAuthenticated());
    res.send('user is looged in ')
})

app.get('/auth/fail', (req, res, next) => {
    res.send('user logged in failed')
})

app.get('/logout', (req, res, next) => {
    req.logOut()
    console.log(req.isAuthenticated());
    res.send('user is logout')
})

app.listen(8000, () => console.log(`sever is running on port ${process.env.PORT}`))