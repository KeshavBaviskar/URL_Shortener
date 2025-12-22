const express = require('express');
const URL = require('../models/url.js');
const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) { return res.redirect('/login'); }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
        urls: allurls,
        baseUrl: baseUrl,
    })
})

router.get('/signup', (req, res) => {
    return res.render("signup")
})
router.get('/login', (req, res) => {
    return res.render("login")
})

module.exports = router;


