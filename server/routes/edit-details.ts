import express, { Request, Response } from 'express';
import Listing from '../db/listings';

const router = express.Router();

interface UpdateHelperBody {
  fields: any; // refine this if you know the exact shape
}

router.put(
  '/:id',
  async (
    req: Request<{ id: string }, {}, UpdateHelperBody>,
    res: Response
  ): Promise<Response> => {
    try {
      const helperId = req.params.id;
      const updatedFields = req.body.fields;

      const updatedHelper = await Listing.findByIdAndUpdate(
        helperId,
        { fields: updatedFields },
        { new: true }
      );

      console.log(updatedHelper);

      if (!updatedHelper) {
        return res.status(404).json({ message: 'Helper not found' });
      }

      return res.status(200).json({
        message: 'Helper updated',
        data: updatedHelper,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  }
);

export default router;
