const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.delete('/:id', async (req, res) => {
    try {
        const helperid = req.params.id;
        const deleted_helper = await Listing.findByIdAndDelete({ _id: helperid });
        if (!deletedHelper) {
            return res.status(404).json({
                message: 'Helper not found'
            });
        }

        return res.status(200).json({
            message: 'Helper deleted', data: deleted_helper
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong!', error: err.message });
    }
});

module.exports = router;