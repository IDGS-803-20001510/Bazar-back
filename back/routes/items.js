const express = require('express');
const router = express.Router();
const data = require('../data/products.json');

console.log(Array.isArray(data.products)); 

const products = data.products;

// Endpoint para obtener productos
router.get('/', (req, res) => {
    const query = req.query.q;
    if (query) {
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        res.json(filteredProducts);
    } else {
        res.json(products);
    }
});


// Endpoint para obtener productos según la búsqueda
router.get('/search', (req, res) => {
    const query = req.query.q;
    if (query) {
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        res.json(filteredProducts);
    } else {
        res.status(400).json({ message: 'Por favor, proporcione un término de búsqueda' });
    }
});


// Endpoint para obtener un producto por su ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convierte el parámetro 'id' a un número entero
    const product = products.find(product => product.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

module.exports = router;

