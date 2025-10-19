// src/database/index.ts
import mongoose from 'mongoose';
import 'dotenv/config';

// Escolha a URI baseada no ambiente (ex: produção vs desenvolvimento)
// const MONGO_URI = process.env.NODE_ENV === 'production' 
//     ? process.env.MONGO_URI_CLOUD 
//     : process.env.MONGO_URI_LOCAL;

// Forçando a conexão com a nuvem (Atlas) para teste
const MONGO_URI = process.env.MONGO_URI_CLOUD;

if (!MONGO_URI) {
    console.error("Erro: A variável de ambiente MONGO_URI não está definida.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB conectado com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error);
        process.exit(1); // Encerra a aplicação em caso de falha na conexão
    }
};

export default connectDB;