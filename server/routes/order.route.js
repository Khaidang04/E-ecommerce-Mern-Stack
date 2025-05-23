const {
  placeOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getOrders,
  getMonthlyIncome,
} = require("../controllers/order.controller");
const { verifyAdmin, verifyToken } = require("../middleware/verifyToken");
const router = require("express").Router();

router.post("/", verifyToken, placeOrder);
router.put("/:id", verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);
router.get("/:id", verifyToken, getUserOrder);
router.get("/", verifyToken, getOrders);
router.get("/stats/income", verifyAdmin, getMonthlyIncome);
module.exports = router;
