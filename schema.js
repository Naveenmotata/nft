const Joi = require('joi'); // Ensure Joi is required



const productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        image: Joi.string().optional().allow(''),  // Allow empty string or missing field
        deliveryFee: Joi.number().optional(),
        location: Joi.string().required(),
        category: Joi.string().required(),

        platformFee: Joi.number().optional(),
    }).required()
});



// Define the transaction schema using Joi
const transactionSchema = Joi.object({
    transaction: Joi.object({
        product: Joi.string().required(), // Assuming product ID will be a string (ObjectId)
        buyer: Joi.string().required(), // Assuming buyer ID will be a string (ObjectId)
        totalPrice: Joi.number().min(0).required(),
        date: Joi.date().default(Date.now), // Date can be optional, defaults to now
    }).required(),
});

// Define the user schema using Joi (for signup)
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profileImage: Joi.string().uri().optional(), // Optional profile image URL
});

// Export all schemas
module.exports = { productSchema, transactionSchema, userSchema };
