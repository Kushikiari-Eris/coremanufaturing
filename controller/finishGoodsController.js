const FinishProduct = require('../models/finishGoodsModels');

// Function to determine status based on stock level
const determineStatus = (unitPrices) => {
    return unitPrices.map((item) => {
        const stock = parseInt(item.stock, 10);
        let status;
        if (stock === 0) {
            status = 'OutOfStock';
        } else if (stock < 20) {
            status = 'LowOnStock';
        } else {
            status = 'InStock';
        }
        return { ...item, status };
    });
};


// Function to add a finish product
const addFinishProduct = async (req, res) => {
    try {
        // Destructure expected fields from req.body
        const { productName, category, description, location, unitPrices } = req.body;
        const image = req.file ? req.file.filename : null;

        // Input validation
        if (!productName || !category || !description || !location || !unitPrices || unitPrices.length === 0) {
            return res.status(400).json({ message: 'All fields are required, including size prices.' });
        }

        // Parse the unitPrices array from the request
        const parsedUnitPrices = JSON.parse(unitPrices); // Ensure unitPrices is parsed correctly

        // Determine status based on stock
        const unitPricesWithStatus = determineStatus(parsedUnitPrices);

        // Create a new instance of FinishProduct
        const newFinishGoods = new FinishProduct({
            productName,
            description,
            category,
            location,
            unitPrize: unitPricesWithStatus, // Use the updated unitPrices with status
            image: image ? `${image}` : null,
        });

        // Save the new product to the database
        await newFinishGoods.save();
        
        // Respond with success message and the new product
        res.status(201).json({ message: "Finish Goods added successfully", product: newFinishGoods });

    } catch (error) {
        console.error('Error adding finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Function to show all finish products
const showAllFinishProducts = async (req, res) => {
    try {
        const products = await FinishProduct.find(); // Fetch all products from the database
        res.status(200).json(products); // Respond with the list of products
    } catch (error) {
        console.error('Error fetching finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const showOnlyFinishProducts = async (req, res) => {
    try {
        const productId = req.params.id

        const product = await FinishProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ product })
    } catch (error) {
        console.error("Error retrieving product:", error)
        res.status(500).json({ message: "Server error" })
    }
};

const editFinishProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameters
    try {
        // Destructure expected fields from req.body
        const { productName, category, description, location, unitPrices } = req.body;
        const image = req.file ? req.file.filename : null; // Handle the image file if present

        // Input validation
        if (!productName || !category || !description || !location || !unitPrices || unitPrices.length === 0) {
            return res.status(400).json({ message: 'All fields are required, including size prices.' });
        }

        // Parse the unitPrices array from the request
        const parsedUnitPrices = JSON.parse(unitPrices); // Ensure unitPrices is parsed correctly

        // Determine status based on stock
        const unitPricesWithStatus = determineStatus(parsedUnitPrices);

        // Find the product by ID and update it
        const updatedProduct = await FinishProduct.findByIdAndUpdate(
            id,
            {
                productName,
                description,
                category,
                location,
                unitPrize: unitPricesWithStatus, // Use the updated unitPrices with status
                image: image ? `${image}` : undefined, // Update image if present, otherwise leave unchanged
            },
            { new: true } // Option to return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with success message and the updated product
        res.status(200).json({ message: "Finish Goods updated successfully", product: updatedProduct });

    } catch (error) {
        console.error('Error updating finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteFinishProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameters
    try {
        const deletedProduct = await FinishProduct.findByIdAndDelete(id); // Delete the product by ID

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with success message
        res.status(200).json({ message: "Finish Goods deleted successfully", product: deletedProduct });

    } catch (error) {
        console.error('Error deleting finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const decrementStock = async (req, res) => {
    const { size, quantity } = req.body; // Ensure these fields are being destructured
    const { id } = req.params;

    console.log('Updating stock for:', id, req.body); // Log incoming request

    try {
        const product = await FinishGoods.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const sizeInfo = product.sizes.find(s => s.size === size);
        if (!sizeInfo) {
            return res.status(400).json({ message: 'Size not found' });
        }

        if (sizeInfo.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Decrement stock
        sizeInfo.stock -= quantity;
        await product.save();

        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = {
    addFinishProduct,
    showAllFinishProducts,
    editFinishProduct,
    deleteFinishProduct,
    showOnlyFinishProducts,
    decrementStock
};
