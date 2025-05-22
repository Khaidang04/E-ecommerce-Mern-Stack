const mongoose = require('mongoose');
const { Schema } = mongoose;//

const productModel = new Schema({
    title: {
        type: String,
        required: true,//bat buoc
        unique: true, //duy nhat
    },
    desc: {
        type: String,
        required: true,
    },
    // image: {
    //     type: String,
    //     required: true,
    // },
    categories: {
        type: Array,//
        default: [],
    },
    size: {
        type: String,
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
    },
    // createAt: Date.now()//
},
{
    timestamps: true,// true: createAt, updateAt
}
);

module.exports = mongoose.model("Product", productModel)