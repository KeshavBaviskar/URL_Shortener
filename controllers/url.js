const { nanoid } = require('nanoid')
const URL = require('../models/url')
async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' })
    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });
 const baseUrl = `${req.protocol}://${req.get('host')}`;
  const fullShortUrl = `${baseUrl}/url/${shortID}`;
    return res.render("home", {
        id: shortID,
      shortURL: fullShortUrl,
    })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}

async function handleGetShortWebsite(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: {
                timeStamp: Date.now(),
            },
        }
    })
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetAnalytics,
    handleGetShortWebsite,
}