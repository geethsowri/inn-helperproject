import express, { Request, Response } from 'express';
import Listing from '../db/listings';

const router = express.Router();

const generateUniqueEmpId = async (): Promise<string> => {
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

router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const empId = await generateUniqueEmpId();
    return res.send(empId);
  } catch (err: any) {
    console.error('Error generating empId:', err);
    return res.status(500).json({ error: 'Failed to generate ID', details: err.message });
  }
});

export default router;
