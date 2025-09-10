import express, { Request, Response } from 'express';
import Listing from '../db/listings';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await Listing.find();
    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
