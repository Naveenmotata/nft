const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/product.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { productSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

// Define delivery and platform fees
const calculateDeliveryFee = () => {
    // Logic to calculate delivery fee (can be dynamic or fixed)
    return 50; // Example fixed delivery fee
};

const calculatePlatformFee = (price) => {
    // Logic to calculate platform fee (can be a percentage of the price)
    return price * 0.1; // Example 10% platform fee
};

// Validate product data middleware
const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// GET /products/new - Render form to create a new product
router.get("/new", isLoggedIn, (req, res) => {
    res.render("products/new", { messages: req.flash("error") });
});

// GET /products/:id - View a single product
// Assuming you are using Express and have set up user authentication
// In your route handler
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid ID format");
    }

    // Find product data by ID
    const productData = await Product.findById(id);
    
    // Handle case where product does not exist
    if (!productData) {
        req.flash("error", "Product you requested for does not exist");
        return res.redirect("/products");
    }

    // Pass productData and user to the template
    res.render("products/singleproduct", { productData, user: req.user }); // Ensure req.user is defined
}));


// GET /products - List all products
router.get("/", wrapAsync(async (req, res) => {
    const allProducts = await Product.find({});
    res.render("products/index", { allProducts });
}));

// POST /products - Create a new product
router.post("/", isLoggedIn, validateProduct, wrapAsync(async (req, res) => {
    const newProduct = new Product(req.body.product);
    
    // Set seller to the logged-in user
    newProduct.seller = req.user._id;

    // Set the deliveryFee and platformFee automatically on the server
    newProduct.deliveryFee = calculateDeliveryFee();
    newProduct.platformFee = calculatePlatformFee(newProduct.price);

    // Save the new product
    await newProduct.save();
    req.flash("success", "New Product Created");
    res.redirect("/products");
}));

// GET /products/:id/edit - Render form to edit an existing product
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid ID format");
    }
    const productData = await Product.findById(id);
    if (!productData) {
        req.flash("error", "Product you requested for does not exist");
        return res.redirect("/products");
    }
    res.render("products/edit", { productData });
}));

// PUT /products/:id - Update an existing product
router.put("/:id", isLoggedIn, validateProduct, wrapAsync(async (req, res) => {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body.product, {
        new: true, // Return the updated document
        runValidators: true // Validate the updated data against the schema
    });

    // Recalculate fees after the update (optional)
    updatedProduct.deliveryFee = calculateDeliveryFee();
    updatedProduct.platformFee = calculatePlatformFee(updatedProduct.price);

    await updatedProduct.save();

    if (!updatedProduct) {
        req.flash("error", "Product you tried to update does not exist");
        return res.redirect("/products");
    }
    req.flash("success", "Product Updated");
    res.redirect(`/products/${id}`);
}));

// DELETE /products/:id - Delete a product
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        req.flash("error", "Product you tried to delete does not exist");
        return res.redirect("/products");
    }
    req.flash("success", "Product Deleted");
    res.redirect("/products");
}));


// Placeholder for cart (in-memory or session storage)
// Ideally, you would have a proper Cart model
let cart = [];

// Add to Cart Route
router.post("/cart/add", isLoggedIn, (req, res) => {
    const { productId } = req.body;
    
    // Here you could add logic to check if product already in cart, etc.
    cart.push(productId);
    
    req.flash("success", "Product added to cart");
    res.redirect("/products"); // Redirect to products or cart page
});

// Checkout Route
router.post("/cart/checkout", isLoggedIn, wrapAsync(async (req, res) => {
    const { productId } = req.body;

    // Logic to process the purchase
    // This could involve creating an order, reducing inventory, etc.
    const product = await Product.findById(productId);
    
    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }

    // Here you would handle the checkout logic (e.g., payment processing)
    req.flash("success", "Purchase successful!");
    res.redirect("/products"); // Redirect to a confirmation or products page
}));


module.exports = router;
