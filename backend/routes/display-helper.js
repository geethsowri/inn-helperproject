const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.get('/', async (req, res) => {
    try {
        const users = await Listing.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;