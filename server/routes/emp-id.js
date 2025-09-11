const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

const generateUniqueEmpId = async () => {
  let isUnique = false;
  let empId = '';

  while (!isUnique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    empId = `${randomNum}`;

    const existing = await Listing.findOne({ emp_id: empId });
    if (!existing) {
      isUnique = true;
    }
  }

  return empId;
};

router.get('/', async(req,res) => {
    try {
        const empId = await generateUniqueEmpId();
        res.send(empId);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate ID' });
    }
})

module.exports = router;