const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const register =  async (req, res) => {
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
            message: "Loi khi tao user",
            error: error,
        })
    }
};

const login =  async (req, res) => {
    try {
    // const {email, password} = req.body;
    const user = await User.findOne({email: req.body.email});// tim kiem user theo email
    if (!user) {
        return res.status(404).json({
            message: "Khong tim thay user",
        })
    }

    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    if (!comparePassword){
        return res.status(404).json({
            message: "Sai mat khau",
        })
    }
    const token = jwt.sign({
        userId: user._id,
        isAdmin: user.isAdmin,
    }
    , process.env.JWT_KEY, {expiresIn: "5d"});
    const {password, ...info} = user._doc;
    res.status(200).json({
        data: {...info, token},
        message: "Login thanh cong",
    })
    
    } catch(error){
        console.log(error);
        res.status(200).json({
            message: "Loi khi login",
            error: error,
        })
    }
  
};
module.exports = {
    register,
    login,
};