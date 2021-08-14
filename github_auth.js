const express = require('express')
require('dotenv').config()
const passport = require('passport')
const { Strategy } = require('passport-github2')
const app = express()

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((user, cb) => {
    cb(null, user)
})

passport.use(new Strategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "http://localhost:8000/auth/github/redirect"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile, 'test')
        done(null, {})
    }
))

app.get('/auth/github', passport.authenticate('github', { scope: ['profile'] }))

app.get('/auth/github/redirect', passport.authenticate('github', { failureRedirect: "/auth/fail" }), (req, res, next) => {
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