const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save()

        const {password, ...info} = newUser._doc;
        res.status(200).json({
            message: "User tao thanh cong",
            data: info,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User tao that bai",
            error: error,
        })
    }
})
module.exports = router;

router.post("/login", async (req, res) => {
    try {
    // const {email, password} = req.body;
    const user = await User.findOne({email: req.body.email});// tim kiem user theo email
    if (!user) {
        return res.status(404).json({
            message: "Email khong ton tai",
        })
    }

    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    if (!comparePassword){
        return res.status(404).json({
            message: "Mat khau khong chinh xac",
        })
    }
    const token = jwt.sign({
        userId: user._id,
        isAdmin: user.isAdmin,
    }
    , process.env.JWT_KEY, {expiresIn: "7d"});
    const {password, ...info} = user._doc;
    res.status(200).json({
        data: {...info, token},
        message: "Login thanh cong",
    })
    
    } catch(error){
        console.log(error);
        res.status(200).json({
            message: "Login Failed",
            error: error,
        })
    }
  
})
module.exports = router;