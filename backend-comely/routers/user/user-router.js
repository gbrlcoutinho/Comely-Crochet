const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.use((req, res, next) => {
    req.prisma = require('../../server').prisma;
    next();
});

router.post('/register ', async (req, res) => {
    try {
        const {name, email, password, isAdmin} = req.body;

        const userExists = await req.prisma.user.findUnique({
            where: {email:email}
        });

        if (userExists) {
            return res.status(400).json({error: "This email already exists"});
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await req.prisma.user.create ({
            data: {
                name: name,
                email: email,
                password: encryptedPassword,
                isAdmin: isAdmin || false
            }
        });
            res.status(200).json({message: "User was succesfully created"});
    }

    catch (error){
        console.error(error);
        res.status(500).json({error: "Error when registering user."});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await req.prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return req.status(404).json({Error: "User not found."});
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return req.status(401).json({Error: "Incorrect password."});
        }

        const token = jwt.sign (
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message: "Succesfully logged in!",
            token: token
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({Error: "Error when logging in."});
    }
});

module.exports = router