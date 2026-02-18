const express = require('express');
const URL = require('../models/url.js');
const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) { return res.redirect('/login'); }
    try {
        // Add cache control headers to prevent caching
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const allurls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        return res.render("home", {
            urls: allurls,
            baseUrl: baseUrl,
            user: req.user,
        });
    } catch (error) {
        console.error("Home page error:", error);
        return res.render("home", {
            urls: [],
            baseUrl: `${req.protocol}://${req.get('host')}`,
            error: "An error occurred while loading URLs",
            user: req.user,
        });
    }
})

router.get('/signup', (req, res) => {
    return res.render("signup")
})
router.get('/login', (req, res) => {
    return res.render("login")
})

module.exports = router;


