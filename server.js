const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'sua_chave_secreta_super_segura_familia_rji';

// Configuração do banco de dados em arquivo JSON
const adapter = new FileSync('db.json');
const db = low(adapter);

// Define estrutura inicial do banco se estiver vazio
db.defaults({ usuarios: [] }).write();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ROTA DE CADASTRO
app.post('/api/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
    }

    // Verificar se e-mail já existe
    const usuarioExiste = db.get('usuarios').find({ email }).value();
    if (usuarioExiste) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        const novoUsuario = {
            id: Date.now(),
            nome,
            email,
            senha: senhaCriptografada
        };

        db.get('usuarios').push(novoUsuario).write();
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

// ROTA DE LOGIN
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = db.get('usuarios').find({ email }).value();
    if (!usuario) {
        return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, email: usuario.email },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({ mensagem: 'Login realizado com sucesso!', token, nome: usuario.nome });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
