import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import addListingsRouter from "./routes/add-listings";
import displayHelpers from "./routes/display-helper";
import getUserDetails from "./routes/get-user-details";
import editDetails from "./routes/edit-details";
import deleteHelper from "./routes/delete-user";
import empID from "./routes/emp-id";
import downloadDetails from "./routes/download-helpers";

const app: Application = express();
const port: number = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json());

app.use("/", addListingsRouter);
app.use("/display", displayHelpers);
app.use("/getdetails", getUserDetails);
app.use("/updatedetails", editDetails);
app.use("/delete", deleteHelper);
app.use("/generate-unique-id", empID);
app.use("/download", downloadDetails);

async function connectDB(): Promise<void> {
    try {
        await mongoose.connect("mongodb://localhost:27017/helpers");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});