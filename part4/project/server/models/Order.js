const mongoose = require("mongoose")
const Schema = mongoose.Schema
const orderSchema = new Schema({
    date: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },
    status: {
        type:String,
         enum: ["completed", "process","exist"] ,
        required: true,
        default:"exist"
    },
    goods:{
        type:mongoose.Schema.ObjectId,
        ref:"Goods",
        required:true
        },
     supplier:{
        type:mongoose.Schema.ObjectId,
        ref:"Supplier",
        required:true
     },
    amount: {
        type: mongoose.Schema.Types.Int32,
        required: true
    },   
}, { timestamps: true })
module.exports = mongoose.model("Order", orderSchema)