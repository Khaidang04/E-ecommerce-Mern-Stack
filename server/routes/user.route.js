const router = require("express").Router();
const {
  getUserById,
  updatedUser,
  deleteUser,
  getAllUsers,
  getUserStats,
  getUserProfile,
} = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");
const { parser } = require("../utils/cloudinary");

router.get("/all", verifyAdmin, getAllUsers);
router.get("/stats", verifyAdmin, getUserStats);
router.get("/profile", verifyToken, getUserProfile);
router.get("/:id", verifyAdmin, getUserById);
router.put("/:id", verifyToken, parser.single("avatar"), updatedUser);
router.delete("/:id", verifyAdmin, deleteUser);

module.exports = router;
