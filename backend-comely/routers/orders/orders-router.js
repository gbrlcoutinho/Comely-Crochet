const express = require('express');
const router = express.Router();
const { authToken } = require('../../middlewares/auth');

router.use((req, res, next) => {
    req.prisma = require('../../server').prisma;
    next()
});

router.post('/orders', authToken, async(req, res) => {
    try {
        const { items } = req.body;

        const userId = req.loggedUser.id;

        let orderTotal = 0;
        const allItems = [];

        for (const item of items) {
            const product = await req.prisma.product.findUnique({
                where: { id: item.product}
            });
            if (!product) {
                return res.status(404).json({Error: "Product not found."});
            }
            if (product.stock < item.quantity) {
                return res.status(400),json({Error: `Insufficient stock of ${product.title}`});
            }

            orderTotal += product.price * item.quantity;
            
            allItems.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price
            });
        }
    
    }

    catch(error) {
        console.error("Error placing the order", error);
        res.status(500).json({Error: "The purchase could not be completed"});
    }
});

module.exports = router;