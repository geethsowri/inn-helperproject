import { Router } from "express";
import Helper from "../models/helper.model";

const router = Router();

// Get all helpers
router.get("/", async (req, res) => {
  const helpers = await Helper.find();
  res.json(helpers);
});

// Get one helper
router.get("/:id", async (req, res) => {
  const helper = await Helper.findById(req.params.id);
  res.json(helper);
});

// Add new helper
router.post("/", async (req, res) => {
  const newHelper = new Helper(req.body);
  await newHelper.save();
  res.json(newHelper);
});

export default router;