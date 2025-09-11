const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const addListingsRouter = require('./routes/add-listings');
const displayHelpers = require('./routes/display-helper');
const getUserDetails = require('./routes/get-user-details')
const editDetails = require('./routes/edit-details');
const deleteHelper = require('./routes/delete-user');
const empID = require('./routes/emp-id');
const downloadDetails = require('./routes/download-helpers');
const uploadProfile = require('./routes/upload-profile');
const uploadKyc = require('./routes/upload-kyc');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',addListingsRouter);
app.use('/display',displayHelpers);
app.use('/getdetails',getUserDetails);
app.use('/updatedetails',editDetails);
app.use('/delete', deleteHelper);
app.use('/generate-unique-id', empID);
app.use('/download',downloadDetails);
app.use('/', uploadProfile);
app.use('/', uploadKyc);

async function connectDB() {
    mongoose.connect("mongodb://localhost:27017/helpers")
}

connectDB().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.get('/', (req,res) => {
    res.send('Hello World!');
})

app.listen(port);
