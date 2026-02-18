const express = require('express');
const { handlegenerateNewShortURL, handleDeleteURL, handleGetClickCounts, handleGetShortWebsite } = require('../controllers/url')
const router = express.Router();

router.post('/', handlegenerateNewShortURL);
router.get('/clicks', handleGetClickCounts);
router.delete('/:shortId', handleDeleteURL);
router.get('/:shortId', handleGetShortWebsite)

module.exports = router;
