const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const router = express.Router()

router.get('/', async (req, res) => {
    const { url } = req.query
    if (!url) return res.status(400).json({ error: 'no url provided' })

    try {
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        const $ = cheerio.load(response.data)

        $('a, link, script, img').each((_, el) => {
            const attr = $(el).prop('tagName') === 'SCRIPT' ? 'src' : 'href'
            const original = $(el).attr(attr)
            if (original && !original.startsWith('http')) {
                $(el).attr(attr, `/proxy?url=https://www.youtube.com${original}`)
            }
        })

        res.send($.html())
    } catch (err) {
        res.status(500).json({ error: 'proxy failed' })
    }
})

module.exports = router
