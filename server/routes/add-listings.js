const express = require('express');
const mongoose = require('mongoose');
const Listing = require('../db/listings');
const router = express.Router();

router.post('/add-helper', async(req, res) => {
    try{
        console.log('Received add-helper request:', req.body);
        
        if (!req.body.emp_id || !req.body.fields) {
            return res.status(400).json({ error: "Missing emp_id or fields" });
        }

        let helper_listing = new Listing({ 
            emp_id: req.body.emp_id,
            fields: req.body.fields 
        });

        helper_listing = await helper_listing.save();
        console.log('Helper saved successfully:', helper_listing._id);
        return res.status(201).json({ message: "Helper added", data: helper_listing });
    }
    catch(err) {
        console.error("Error adding helper:", err);
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
})

module.exports = router;