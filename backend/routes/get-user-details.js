const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.get('/:id', async(req, res) => {
    try {
        const helperid = req.params.id;
        const helper = await Listing.findById(helperid);
        if(!helper) {
            return res.status(400).json({message: 'Helper not found'});
        }
        res.json(helper);
    } catch (error) {
        console.error(err);
        res.status(500).json({message: 'Server Error!'});
    }
});

module.exports = router;