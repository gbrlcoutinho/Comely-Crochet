const express = require('express');
const cors = require ('cors');
const { PrismaClient } = require('@prisma/client');
const crochet = require('./router/crochet/croche-router')

const prisma = new PrismaClient();
const app = express();

// Exportar prisma para outros módulos
module.exports = { prisma };

app.use(express.json());
app.use(cors());
app.use(crochet);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running successfully on port http://localhost:${PORT}`);
});