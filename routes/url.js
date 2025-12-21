const express = require('express');
const { handlegenerateNewShortURL, handleGetAnalytics, handleGetShortWebsite } = require('../controllers/url')
const router = express.Router();

router.post('/', handlegenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics)
router.get('/:shortId', handleGetShortWebsite)

module.exports = router;