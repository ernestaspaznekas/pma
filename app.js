const express       = require('express')
const walletRoute   = require('./routes/wallet')

const app           = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', walletRoute)

module.exports = app
