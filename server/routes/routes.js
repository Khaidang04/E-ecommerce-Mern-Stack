const router = require("express").Router();
const userRoutes = require("./user.route.js");
const authRoutes = require("./auth.routes.js");

const base = "/api/v1";
router.use(`${base}/users`, userRoutes);// http://localhost:4000/api/v1/users/get-users
router.use(`${base}/auth`, authRoutes); //
module.exports = router;
//http://localhost:4000/api/v1/auth/register
