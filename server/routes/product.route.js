const { createProduct } = require("../controllers/product.controller");
const { verifyAdmin } = require("../middleware/verifyToken");
const { parser } = require("../utils/cloudinary");
const router = require('express').Router();

router.post("/", verifyAdmin, parser.single("image"), createProduct);

module.exports = router;