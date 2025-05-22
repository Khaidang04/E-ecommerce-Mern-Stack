const { create } = require('../models/cart.model');
const Order = require('../models/order.model');

const createOrder = async (req, res) => {
    try {
            const newOrder = new Order(req.body);
        await newOrder.save()
        res.status(200).json({
            message: "Dat hang thanh cong",
            data: newOrder
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Dat hang khong thanh cong",
            error: error.message
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate
        (req.params.id, 
            {
            $set: req.body
            },
            {
            new: true
            }
        );
        res.status(200).json({
            message: "Cap nhap don hang thanh cong",
            data: updateOrder
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi cap nhat don hang",
            error: error.message
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id,);
        res.status(200).json({
            message: "Xoa don hang thanh cong",
            data: deleteOrder
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi xoa gio hang",
            error: error.message
        })
    }
}

const getUserOrder = async (req, res) => {
    try {
        const Order = await Order.findOne({userId: req.params.id});
        res.status(200).json({
            message: "Lay don hang thanh cong",
            data: Order
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay don hang",
            error: error.message
        })
}}

const getOrders = async (req, res) => {
    try {
        const Orders = await Order.find();
        res.status(200).json({
            message: "Lay danh sach don hang thanh cong",
            data: Orders
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay danh sach don hang",
            error: error.message
        })
    }
}

const getMonthlyIncome = async (req, res) => {
    try {
        const date = new Date()// Thay đổi ngày tháng năm ở đây
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1))//
        const prevMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1))
        const startOfYear = new Date(new Date().getFullYear() - 1); 
        const getMonthlyIncome = await Order.aggregate([
            {
                // $match: {createdAt: {$gte: prevMonth}}// Lọc các đơn hàng được tạo trong tháng trước
                $match: { createdAt: { $gte: startOfYear } }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},// Lấy tháng của đơn hàng
                    sales: "$amount"// Lấy số tiền của đơn hàng
                }
            },
            {
                $group: {
                    _id: "$month",// Nhóm theo tháng
                    total: {$sum: "$sales"}// Tính tổng số tiền của các đơn hàng trong tháng
                }
            }
        ])
        res.status(200).json({
            message: "Lay thu nhap hang thang thanh cong",
            data: getMonthlyIncome
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay thu nhap hang thang",
            error: error.message
        })
    }
}
module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrder,
    getOrders,
    getMonthlyIncome
}
