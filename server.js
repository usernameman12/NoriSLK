const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const proxy = require('./public/proxy')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: true }))
app.use(express.static(path.join(__dirname, 'public')))

// authentication api
app.use('/api', require('./api/login'))
app.use('/api', require('./api/signup'))

// proxying youtube
app.use('/proxy', proxy)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
