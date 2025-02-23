const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const usersFile = path.join(__dirname, '../private/users.json')

router.post('/signup', (req, res) => {
    const { username, password } = req.body
    const users = JSON.parse(fs.readFileSync(usersFile))

    if (users[username]) {
        return res.status(400).json({ error: 'username taken' })
    }

    users[username] = password
    fs.writeFileSync(usersFile, JSON.stringify(users))
    req.session.user = username
    res.json({ success: true })
})

module.exports = router
