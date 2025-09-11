const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.delete('/:id', async (req, res) => {
  try {
    const helperId = req.params.id;

    const deletedHelper = await Listing.findByIdAndDelete({ _id: helperId });

    if (!deletedHelper) {
      console.log("it entered not found region");
      return res.status(404).json({ message: 'Helper not found' });
    }
    console.log("it entered delete user region");
    return res.status(200).json({ message: 'Helper deleted', data: deletedHelper });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


module.exports = router;