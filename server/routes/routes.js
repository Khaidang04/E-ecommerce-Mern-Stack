const router = require("express").Router();
const userRoutes = require("./user.route.js");
const base = "/api/v1";
router.use(`${base}/users`, userRoutes); // Use backticks (`) for template literal
module.exports = router;

//http://localhost:4000/api/v1/users/get-users
