const express = require('express');
const dbConnect = require('./dbConnect/dbConnection');
const routes = require('./routes/routes');
const app = express();
const userRoutes = require('./routes/user.route.js');


// app.use("/", routes);
app.use("/api/v1/users", userRoutes)
app.get("/", (req, res) => {
    res.send("My backend is complete");
})
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ${process.env.PORT || 5000}');
    dbConnect()
})