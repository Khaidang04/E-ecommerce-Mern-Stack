const { updatedUser, deleteUser, getAdmin, getAllUsers, getUserStats }= require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");
const router  = require("express").Router();


router.get("/get-users", (req, res) => {
    res.send("Nguoi dung da duoc nhan");
});

router.put("/update/:id", verifyToken, updatedUser);
router.delete("/delete/:id", verifyAdmin, deleteUser);
router.get("/get-admin/:id", verifyAdmin, getAdmin)
router.get("/", verifyToken, getAllUsers)
router.get("/stats", verifyAdmin, getUserStats)
module.exports = router;
