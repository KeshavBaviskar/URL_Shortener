const { nanoid } = require('nanoid')
const URL = require('../models/url')

// URL validation helper - very lenient validation
function isValidUrl(string) {
    if (!string || typeof string !== 'string') return false;
    
    string = string.trim();
    if (string.length === 0) return false;
    
    try {
        const url = new URL(string);
        // Check if protocol is http or https
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }
        // If hostname exists, it's valid
        return url.hostname && url.hostname.length > 0;
    } catch (error) {
        // If URL constructor fails, try basic pattern matching
        // Accept anything that looks like a domain or URL
        const urlPattern = /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;
        const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;
        return urlPattern.test(string) || domainPattern.test(string);
    }
}

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        const allurls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return res.render("home", {
            urls: allurls,
            baseUrl: baseUrl,
            error: "URL is required",
            user: req.user,
        });
    }
    
    // Validate URL format
    let urlToShorten = body.url.trim();
    
    if (urlToShorten.length === 0) {
        const allurls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return res.render("home", {
            urls: allurls,
            baseUrl: baseUrl,
            error: "URL cannot be empty",
            user: req.user,
        });
    }
    
    // Add protocol if missing
    if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
        urlToShorten = 'https://' + urlToShorten;
    }
    
    // Very lenient validation - just check it's not empty and doesn't have spaces
    if (urlToShorten.includes(' ') || urlToShorten.length < 4) {
        const allurls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return res.render("home", {
            urls: allurls,
            baseUrl: baseUrl,
            error: "Invalid URL format. Please enter a valid URL (e.g., example.com or https://example.com)",
            user: req.user,
        });
    }
    
    try {
        const shortID = nanoid(8);
        await URL.create({
            shortId: shortID,
            redirectURL: urlToShorten,
            visitHistory: [],
            createdBy: req.user._id,
        });
        // Add cache control headers to prevent caching
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        return res.redirect('/');
    } catch (error) {
        console.error("URL creation error:", error);
        const allurls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return res.render("home", {
            urls: allurls,
            baseUrl: baseUrl,
            error: "An error occurred. Please try again.",
            user: req.user,
        });
    }
}

async function handleDeleteURL(req, res) {
    const shortId = req.params.shortId;
    try {
        // Find the URL and verify it belongs to the user
        const url = await URL.findOne({ shortId, createdBy: req.user._id });
        
        if (!url) {
            return res.status(404).json({ error: "URL not found or you don't have permission to delete it" });
        }
        
        await URL.deleteOne({ shortId, createdBy: req.user._id });
        return res.json({ success: true, message: "URL deleted successfully" });
    } catch (error) {
        console.error("Delete URL error:", error);
        return res.status(500).json({ error: "An error occurred while deleting the URL" });
    }
}

async function handleGetClickCounts(req, res) {
    try {
        const allurls = await URL.find({ createdBy: req.user._id }).select('shortId visitHistory');
        const clickCounts = {};
        allurls.forEach(url => {
            clickCounts[url.shortId] = url.visitHistory.length;
        });
        return res.json({ success: true, clickCounts });
    } catch (error) {
        console.error("Get click counts error:", error);
        return res.status(500).json({ error: "An error occurred while fetching click counts" });
    }
}

async function handleGetShortWebsite(req, res) {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate({ shortId }, {
            $push: {
                visitHistory: {
                    timeStamp: Date.now(),
                },
            }
        });
        if (!entry) {
            return res.status(404).send("Short URL not found");
        }
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Redirect error:", error);
        return res.status(500).send("An error occurred while redirecting");
    }
}

module.exports = {
    handlegenerateNewShortURL,
    handleDeleteURL,
    handleGetClickCounts,
    handleGetShortWebsite,
}
