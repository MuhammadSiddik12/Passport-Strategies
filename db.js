const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err;
    console.log('Connected')
})

const User = mongoose.Schema({
    id: String,
    displayName: String,
})

module.exports = mongoose.model('User', User)