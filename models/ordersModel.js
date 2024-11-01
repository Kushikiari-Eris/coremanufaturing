const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    items: [
        {
            productName: { type: String, required: true },
            productQuantity: { type: Number, required: true},
            price: { type: Number, required: true },
            size: { type: String, required: true },
            image: { type: String }
        }
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    shippingLocation: {
        type: String,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        default: 'Pending' 
    },
    
});

module.exports = mongoose.model('Order', orderSchema);