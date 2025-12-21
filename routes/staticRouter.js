const express = require('express');
const URL = require('../models/url.js');
const router = express.Router();
router.get("/", async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullShortUrl = `${baseUrl}/url/${shortID}`;
    const allurls = await URL.find({})
    return res.render("home", {
        urls: allurls,
        fullShortUrl: fullShortUrl,
    })
})

module.exports = router;


