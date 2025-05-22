const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try {
        const categories = req.body.categories ? req.body.categories.split(",") : [];// Chia categories thành mảng
        const newProduct = new Product({
            ...req.body,
            categories: categories,
            image: req.file.path,}
        );
        await newProduct.save()
        res.status(200).json({
            message: "Tao san pham thanh cong",
            data: newProduct
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi tao san pham",
            error: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate
        (req.params.id, 
            {
            $set: req.body
            },
            {
            new: true
            }
        );
        res.status(200).json({
            message: "Cap nhat san pham thanh cong",
            data: updateProduct
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi cap nhat san pham",
            error: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id,);
        res.status(200).json({
            message: "Xoa san pham thanh cong",
            data: deleteProduct
        })
    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Loi khi xoa san pham",
            error: error.message
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            message: "Lay san pham thanh cong",
            data: product
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi lay san pham",
            error: error.message
        })
}}

const getProducts = async (req, res) => {
    try {
        const qLatest = req.query.latest;// Lay danh sach san pham moi nhat
        const qCategory = req.query.category;// Lay danh sach san pham theo category
        
        let products;
        if (qLatest) {
            products = await Product.find().sort({createdAt: -1}).limit(2);// Lay 3 san pham moi nhat
        } else if (qCategory) {
            products = await Product.find({// Lay danh sach san pham theo category
                categories: {// Tim san pham theo category
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find();//
        }
        res.status(200).json({
            message: "Lay danh sach san pham thanh cong",
            data: products
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
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts
}