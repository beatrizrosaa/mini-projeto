// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para tipagem forte
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // `?` pois não será retornado em queries
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false } // select: false para não retornar a senha em queries
}, { timestamps: true });

// Middleware (pre-save hook) para fazer o hash da senha antes de salvar
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

export default model<IUser>('User', UserSchema);