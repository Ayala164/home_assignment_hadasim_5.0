const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    roles: {type:[{
        type: String,
        enum: ['Supplier', 'Master'],
        default: "Supplier"}]
    },
    ordersList:{
        type:[{ type: mongoose.ObjectId, ref: 'Order' }],
    } 
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema)