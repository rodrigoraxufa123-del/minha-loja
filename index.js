const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Torna a pasta atual pública para servir arquivos estáticos (HTML, CSS, JS do front-end)
app.use(express.static(path.join(__dirname, '/')));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
