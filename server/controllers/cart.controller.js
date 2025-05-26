const Cart = require('../models/cart.model');

const createCart = async (req, res) => {
    try {
        //Kiem tra xem userId da ton tai trong database chua
        const { userId, products } = req.body;
        const existingCart = await Cart.findOne({ userId });
        if (existingCart) {
            return res.status(400).json({
                message: "Gio hang da ton tai",   
                data: existingCart
            });
        }
        const newCart = new Cart({ userId, products });
        await newCart.save()
        
        res.status(201).json({
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
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({
                message: "Gio hang khong ton tai"
            })
        }
        //Neu gio hang ton tai, cap nhat gio hang
        if (!req.body.products || !Array.isArray(req.body.products)){
            return res.status(400).json({
                message: "Du lieu khong hop le"
            })
        }
        //Lap qua danh sach san pham can cap nhap tu request
        req.body.products.forEach(newProduct => {
            //Tim san pham trong gio hang
            const existingProuct = cart.products.find(products => products.productId === newProduct.productId)
            if (existingProuct) {
                //Neu san pham da ton tai trong gio hang, cap nhat so luong
                existingProuct.quantity += newProduct.quantity
            } else {
                //Neu san pham chua ton tai trong gio hang, them san pham vao gio hang
                cart.products.push(newProduct)
            } 
        })
        //Luu cap nhat gio hang
        const updateCart = await cart.save();
        res.status(200).json({
            message: "Cap nhat gio hang thanh cong",
            data: cart
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
        const deleted = await Cart.findByIdAndDelete(req.params.id,);
        if (!deleted) {
            return res.status(404).json({
                message: "Gio hang khong ton tai"
            })
        }
        //Neu gio hang ton tai, xoa gio hang
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
//Lay gio hang cua user
const getUserCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({userId: req.params.id});
        if (!cartItem) {
            return res.status(404).json({
                message: "Gio hang khong ton tai"
            })  
        }
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
            message: "Lay danh sach gio hang thanh cong",
            data: cartItems
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay danh sach gio hang",
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
