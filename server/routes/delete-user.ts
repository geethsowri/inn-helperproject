import express, { Request, Response } from 'express';
const router = express.Router();
import Listing from '../db/listings';

router.delete('/:id', async (req: Request, res: Response) : Promise<Response> => {
  try {
    const helperId: string = req.params.id;

    const deletedHelper = await Listing.findByIdAndDelete({helperId});

    if (!deletedHelper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    return res.status(200).json({ message: 'Helper deleted', data: deletedHelper });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


export default router;