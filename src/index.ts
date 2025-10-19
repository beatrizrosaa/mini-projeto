// src/index.ts
import express from 'express';
import 'dotenv/config';
import connectDB from './database';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Usar as rotas
app.use(routes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});