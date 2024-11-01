const Order = require('../models/ordersModel')

const orders = async (req, res) => {
    try {
        const { userId, name, address, contactNumber, paymentMethod, items, totalAmount, shippingLocation, shippingFee } = req.body;

        // Create new order
        const newOrder = new Order({
            userId,
            customerName: name,
            address,
            contactNumber,
            paymentMethod,
            items,
            totalAmount,
            shippingLocation,
            shippingFee,
            orderDate: new Date(),
            status: 'Pending', // Default status
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with the newly created order
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
}


const showAllOrders = async (req, res) => {
    // Fetch all orders from the database
    Order.find({})
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json({ message: 'Error fetching orders' }));
}

// Get orders by user ID
const showOrdersByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userOrders = await Order.find({ userId }); // Query the database

        if (userOrders.length === 0) {
            // Return 200 OK even if no orders found (empty array)
            return res.status(200).json(userOrders);
        } else {
            return res.status(200).json(userOrders); // Return the orders
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
}




module.exports = {
    orders,
    showAllOrders,
    showOrdersByUser
}