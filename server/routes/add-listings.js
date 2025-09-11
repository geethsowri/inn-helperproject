const express = require('express');
const mongoose = require('mongoose');
const Listing = require('../db/listings');
const router = express.Router();

router.post('/add-helper', async(req, res) => {
    try{
        let helper_listing = new Listing({ emp_id:req.body.emp_id,fields: req.body.fields });

        helper_listing = await helper_listing.save();
        return res.status(201).json({ message: "Helper added", data: helper_listing });
    }
    catch(err) {
        console.error("Error adding helper:", err);
        return res.status(500).json({ error: "error" });
    }
})

module.exports = router;