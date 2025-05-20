const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const User = require("../models/user.model");

router.post("/register", register);
router.post("/login", login);

module.exports = router;