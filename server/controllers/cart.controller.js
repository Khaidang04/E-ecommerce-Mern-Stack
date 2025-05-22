const Cart = require('../models/cart.model');

const createCart = async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save()
        res.status(200).json({
            message: "Tao gio hang thanh cong",
            data: newCart
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi tao gio hang",
            error: error.message
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate
        (req.params.id, 
            {
            $set: req.body
            },
            {
            new: true
            }
        );
        res.status(200).json({
            message: "Cap nhat gio hang thanh cong",
            data: updateCart
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi cap nhat gio hang",
            error: error.message
        })
    }
}

const deleteCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id,);
        res.status(200).json({
            message: "Xoa gio hang thanh cong",
            data: deleteCart
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi xoa gio hang",
            error: error.message
        })
    }
}

const getUserCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        res.status(200).json({
            message: "Lay gio hang thanh cong",
            data: cartItem
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay gio hang",
            error: error.message
        })
}}

const getCartItems = async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.status(200).json({
            message: "Lay danh sach san pham thanh cong",
            data: cartItems
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay danh sach san pham",
            error: error.message
        })
    }
}


module.exports = {
    createCart,
    updateCart,
    deleteCart,
    getUserCartItem,
    getCartItems
}
