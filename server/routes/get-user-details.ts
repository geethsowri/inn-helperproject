import express, { Request, Response } from 'express';
import Listing from '../db/listings';

const router = express.Router();

router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const helperId = req.params.id;
    const helper = await Listing.findById(helperId);

    if (!helper) {
      return res.status(400).json({ message: 'Helper not found' });
    }

    return res.json(helper);
  } catch (error: any) {
    console.error('Error fetching helper:', error);
    return res.status(500).json({ message: 'Server Error', details: error.message });
  }
});

export default router;