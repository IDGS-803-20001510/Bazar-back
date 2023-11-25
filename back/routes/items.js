const express = require('express');
const router = express.Router();
const routerUsers = express.Router();
const fs = require('fs');
const data = require('../data/products.json');
const dataUsers = require('../data/usuarios.json');

console.log(Array.isArray(data.products)); 

const products = data.products;
const users = dataUsers.usuarios;

// Middleware de registro
const logMiddleware = (req, res, next) => {
    const isProductRequest = req.path.startsWith('/api/items');
    const isUserRequest = req.path.startsWith('/api/users');

    const logEntry = {
        fecha: new Date().toISOString(),
        hora: new Date().toLocaleTimeString('es-ES', { timeZone: 'America/Mexico_City', hour12: false }),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        tipo: isProductRequest ? 'producto' : 'usuario' 
    };

    const logEntryJSON = JSON.stringify(logEntry, null, 2);
    console.log('Registro de solicitud:', logEntry);
    const logFilePath = './LogRespuestas.json';

    fs.appendFile(logFilePath, `${logEntryJSON},\n`, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro:', err);
        } else {
            console.log('Registro de solicitud guardado en el archivo:', logEntryJSON);
        }
    });
    next();
};

// Aplicar middleware de registro a todas las rutas
router.use(logMiddleware);
routerUsers.use(logMiddleware);

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


// Endpoint para obtener los usuarios
routerUsers.get('/getUsers', (req, res) => {
    const query = req.query.q;
    if (query) {
        const filteredUsers = users.filter(users =>
            users.email.toLowerCase().includes(query.toLowerCase())
        );
        res.json(filteredUsers);
    } else {
        res.json(users);
    }
});

routerUsers.get('/searchUsers', (req, res) => {
    const emailQuery = req.query.email;
    const contrasenaQuery = req.query.contrasena;

    if (emailQuery && contrasenaQuery) {
        const filteredUsers = users.filter(user =>
            user.email.toLowerCase().includes(emailQuery.toLowerCase()) &&
            user.contrasena === contrasenaQuery
        );
        res.json(filteredUsers);
    } else {
        res.status(400).json({ message: 'Proporcione un correo electrónico y una contraseña para la búsqueda' });
    }
});


module.exports = {
    router: router,
    routerUsers: routerUsers
};
