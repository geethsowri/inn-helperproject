const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.get('/:id', async(req,res) => {
    try{
        const helperId = req.params.id;
        const helper = await Listing.findById(helperId);

        if(!helper) {
            return res.status(404).json({ message: 'Helper not found' });
        }

        res.json(helper);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;