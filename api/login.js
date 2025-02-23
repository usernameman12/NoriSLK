const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const usersFile = path.join(__dirname, '../private/users.json')

// ensure users file exists
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '{}')

router.post('/login', (req, res) => {
    const { username, password } = req.body
    const users = JSON.parse(fs.readFileSync(usersFile))

    if (users[username] && users[username] === password) {
        req.session.user = username
        res.json({ success: true })
    } else {
        res.status(401).json({ error: 'invalid credentials' })
    }
})

module.exports = router
