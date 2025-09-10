import express, { Request, Response } from 'express';
import Listing from '../db/listings';

const router = express.Router();

interface AddHelperBody {
  emp_id: string;
  fields: string[];
}

router.post(
  '/add-helper',
  async (req: Request<{}, {}, AddHelperBody>, res: Response): Promise<Response> => {
    try {
      const { emp_id, fields } = req.body;

      const helper_listing = await new Listing({ emp_id, fields }).save();

      return res.status(201).json({ message: 'Helper added', data: helper_listing });
    } catch (err: any) {
      console.error('Error adding helper:', err);
      return res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
  }
);

export default router;
