const mongoose = require('mongoose');

// Updated priceSchema to include stock
const priceSchema = mongoose.Schema({
    size: {
        type: String,
        enum: ['small', 'medium', 'large'], 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: { // New field to track stock number
        type: Number,
        required: true,
        default: 0, // Default stock number can be 0
    },
    status: { 
        type: String, 
        enum: ['InStock', 'LowOnStock', 'OutOfStock'], default: 'InStock' 
    }
});

// FinishProduct schema remains mostly unchanged
const finishProductSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['soap', 'detergent'], // You can add 'cosmetics' here if needed
        required: true,
    },
    unitPrize: [priceSchema], // This will now include stock
    location: {
        type: String,
        required: true,
    },
},{ timestamps: true });

// Model creation
const FinishProduct = mongoose.model('FinishProduct', finishProductSchema);
module.exports = FinishProduct;
