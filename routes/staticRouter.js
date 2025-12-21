const express = require('express');
const URL = require('../models/url.js');
const router = express.Router();
router.get("/", async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const allurls = await URL.find({})
    return res.render("home", {
        urls: allurls,
        baseUrl: baseUrl,
    })
})

module.exports = router;


