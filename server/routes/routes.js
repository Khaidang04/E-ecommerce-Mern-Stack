const router = require("express").Router();
const userRoutes = require("./user.route.js");
const authRoutes = require("./auth.routes.js");
const productRoutes = require("./product.route.js");
const cartRoutes = require("./cart.route.js");
const orderRoutes = require("./order.route.js");

const base = "/api/v1";
router.use(`${base}/users`, userRoutes); // http://localhost:4000/api/v1/users/get-users
router.use(`${base}/auth`, authRoutes); //
router.use(`${base}/products`, productRoutes); //
router.use(`${base}/carts`, cartRoutes); //
router.use(`${base}/orders`, orderRoutes); //
module.exports = router;
