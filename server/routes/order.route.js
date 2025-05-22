const { createOrder, updateOrder, deleteOrder, getUserOrder, getOrders } = require("../controllers/order.controller");
const { verifyAdmin, verifyToken } = require("../middleware/verifyToken");
const router = require('express').Router();

router.post("/", verifyToken, createOrder);
router.put("/:id", verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);
router.get("/:id", verifyToken, getUserOrder);
router.get("/",verifyToken, getOrders);

module.exports = router;