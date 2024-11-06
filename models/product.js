const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) =>
            v === ""
            ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : v,
    },
    
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who is selling the item
        required: true
    },
    location: {
        type: String, // Optional: Location of the product
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isSold: {
        type: Boolean,
        default: false
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
