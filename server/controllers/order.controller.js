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
        const Order = await Order.findById({userId: req.params.id});
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


module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrder,
    getOrders
}
