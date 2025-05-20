const router  = require("express").Router();


router.get("/get-users", (req, res) => {
    res.send("Nguoi dung da duoc nhan");
});
module.exports = router;