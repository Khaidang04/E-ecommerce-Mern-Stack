const express = require('express');
const dbConnect = require('./dbConnect/dbConnection');
const app = express();


app.get("/", (req, res) => {
    res.send("My backend is complete");
})
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ${process.env.PORT || 5000}');
    dbConnect()
})