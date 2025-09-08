import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helperRoutes from "./routes/helper.routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/helpersdb");

app.use("/api/helpers", helperRoutes);

app.listen(5000, () => {
  console.log("✅ Backend server running at http://localhost:5000");
});