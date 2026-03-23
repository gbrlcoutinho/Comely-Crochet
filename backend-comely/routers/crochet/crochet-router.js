const express = require('express');
const router = express.Router();
const { verificarToken, verificarAdmin, authToken, authAdmin } = require('../../middlewares/auth');

// Middleware para injetar prisma
router.use((req, res, next) => {
    req.prisma = require('../../server').prisma;
    next();
});

router.get ('/crochet', async (req,res) => {
    try {
        const allProducts = await req.prisma.product.findMany();

        res.status(200).json(allProducts);
    }

    catch (error) {
        console.log("There was an error while fiding all products :(", error);
        res.status(500).json({error: "Couldn't get the available crochets!"})
    }
});

router.post('/crochets', authToken, authAdmin, async (req, res) => {
    try {
        const { title, description, price, size, material, type, stock, pictureUrl } = req.body;

        const newProduct = await req.prisma.product.create ({
            data: {
                title: "Product name",
                description: "What the product is about",
                price: 80.50,
                size: 15,
                material: "cotton",
                type: "keychain",
                stock: 7,
                pictureUrl: "https://link-temporario-da-foto.com/lola.jpg"
            }
        });

        res.status(201).json(newProduct)
    }

    catch(error) {
        console.error(error);
        res.status(500).json({error: "Error when registering the product in the database"});
    }
});

router.put('/crochets/:id', authToken, authAdmin, async (req, res) => {
    try {
        const { id } = req.params; 
        const dadosAtualizados = req.body; 

        const produtoAtualizado = await req.prisma.product.update({
            where: { id: id },
            data: dadosAtualizados
        });

        res.status(200).json(productUpdated);
    } catch (error) {
        console.error("Error while updating the product!", error);
        res.status(500).json({ error: "It wasn't possible updating the product!" });
    }
});

router.delete('/crochets/:id', authToken, authAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await req.prisma.product.delete ({
            where: { id:id }
        });

        res.status(204).send();
    }

    catch (error) {
        console.error("Error while deleting the product", error);
        res.status(500),json({error: "It wasn't possible deleting the product!"});
    }
});

module.exports = router;