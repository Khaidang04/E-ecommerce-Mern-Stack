const User = require('../models/user.model')

const updatedUser = async  (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {// Tìm người dùng theo id
            $set: req.body// Cập nhật thông tin người dùng
        },{
            new: true// Trả về người dùng đã cập nhật
        })
        if (!updatedUser) {
            return res.status(404).json({message: "User not Found!"})// Nếu không tìm thấy người dùng, trả về lỗi 404
        }
        res.status(200).json({
            message: "User update thanh cong",// Trả về thông báo thành công
            data : updatedUser,// Trả về người dùng đã cập nhật
        })
    }catch (err) {
        console.log(err)// Nếu có lỗi, in lỗi ra console
        res.status(500).json({
            message: "User update that bai",// Trả về thông báo thất bại
            error: err// Trả về lỗi
        })
    }
    
}
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)// Tìm người dùng theo id và xóa
        res.status(200).json({
            message: "User xoa thanh cong",// Trả về thông báo thành công
        })
    }catch (error) {
        console.log(error)
         res.status(500).json({
            message: "User xoa that bai",// Trả về thông báo thất bại
        })
    }
    
}


const getAdmin = async (req, res) => {
    try{
        const admin = await User.findById(req.params.id)// Tìm người dùng theo id
        if (!admin) {
            return res.status(404).json({
                message: "User not Found!"// Nếu không tìm thấy người dùng, trả về lỗi 404
            })
        }

        const {password, ...info} = admin._doc// Lấy thông tin người dùng
        res.status(200).json({
            message: "User duoc tim thay thanh cong",
            data: info// Trả về người dùng đã xóa
        })
    }catch (error){
        console.log(error);
        res.status(500).json ({
            message: "User duoc tim thay that bai",
            error: error// Trả về lỗi
        })
    }
}

const getAllUsers = async (req, res) => {
    const query = req.query.latest// Lấy thông tin người dùng;
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(1) : await User.find();// Tìm người dùng theo id (sort theo id giảm dần và giới hạn 1 người dùng)
        res.status(200).json({
            message: "User duoc tim thay thanh cong",
            data: users// Trả về người dùng đã xóa
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User duoc tim thay that bai",
            error: error// Trả về lỗi
        })
    }
    try{
        const users = await User.find()// Tìm người dùng theo id

        res.status(200).json({
            message: "User dusoc tim thay thanh cong",
            data: users// Trả về người dùng đã xóa
        })
    }catch (error){
        console.log(error);
        res.status(500).json ({
            message: "User duoc tim thay that bai",
            error: error// Trả về lỗi
        })
    }
}
//thong ke
const getUserStats = async (req, res) => {
    try {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() -1))
        const userStats = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } },// Tìm người dùng theo id
            },
            {
                $project: {
                    month: { $month: "$createdAt" },// Lấy tháng của ngày tạo
                },
            },
            {
                $group: {
                    _id: "$month",// Nhóm theo tháng
                    total: { $sum: 1 },// Tổng số người dùng
                },
            }
        ])
        res.status(200).json({
            message: "Thong ke nguoi dung thanh cong",
            data: userStats// Trả về người dùng đã xóa
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay thong ke nguoi dung",
            error: error.message
        }) 
    }
}

module.exports = { updatedUser, deleteUser, getAdmin, getAllUsers, getUserStats}; 