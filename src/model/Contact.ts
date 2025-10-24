import mongoose, { Document, Schema } from 'mongoose';

// Interface para definir o tipo do documento (para o TypeScript)
export interface IContact extends Document {
  name: string;
  email?: string; // O email é opcional
  phone: string;
  user: mongoose.Schema.Types.ObjectId; // O ID do usuário dono deste contato
}

// Schema do Mongoose (a estrutura no banco de dados)
const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false, // Opcional
  },
  phone: {
    type: String,
    required: true,
  },
  // Esta é a parte mais importante!
  // É o "link" que conecta este contato ao usuário que o criou.
  user: {
    type: mongoose.Schema.Types.ObjectId, // Tipo especial para IDs do Mongoose
    ref: 'User', // Refere-se à coleção 'User'
    required: true,
  },
}, {
  // Adiciona 'createdAt' e 'updatedAt' automaticamente
  timestamps: true, 
});

// Exporta o modelo
export default mongoose.model<IContact>('Contact', ContactSchema);