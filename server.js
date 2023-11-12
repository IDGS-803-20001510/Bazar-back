const express = require('express');
const app = express();
const itemsRouter = require('./back/routes/items');

app.use('/api/items', itemsRouter);

const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
