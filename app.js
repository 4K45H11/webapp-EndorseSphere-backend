const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const authRoutes = require('./routes/auth.route')
const contentRoutes = require('./routes/content.route')

const app = express()

app.use(express.json())
app.use(cors({
    origin: "*",
    credentials:'false'
}))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.status(200).send('Welcome to the ENDO server')
})

app.use('/auth',authRoutes)
app.use('/content',contentRoutes)


module.exports = {app}