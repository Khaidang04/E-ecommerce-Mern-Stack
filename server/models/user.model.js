const mongoose = require('mongoose');
const { Schema } = mongoose;//

const userModel = new Schema({
    isAdmin: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String,// ten nguoi dung
        required: true,//bat buoc
        unique: true, //duy nhat
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // createAt: Date.now()//
},
{
    timestamps: true,// true: createAt, updateAt
}
);

module.exports = mongoose.model("User", userModel)