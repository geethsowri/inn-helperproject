const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.put('/:id', async (req, res) => {
  try {
    const helperId = req.params.id;
    const updatedFields = req.body;

    const updatedHelper = await Listing.findByIdAndUpdate(
      helperId,
      { fields: updatedFields },
      { new: true }
    );

    console.log(updatedHelper)

    if (!updatedHelper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    return res.status(200).json({ message: 'Helper updated', data: updatedHelper });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


module.exports = router;
