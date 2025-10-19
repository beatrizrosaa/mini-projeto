import User, { IUser } from '../model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

class AuthService {
    public async register(userData: IUser): Promise<IUser> {
        console.log(`[Service] Tentando registrar usuário com email: ${userData.email}`);

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.error(`[Service] Erro: E-mail já cadastrado: ${userData.email}`);
            throw new Error('E-mail já cadastrado.');
        }

        const user = new User(userData);
        await user.save();
        console.log(`[Service] Usuário registrado com sucesso: ${user.email}`);

        const userObject = user.toObject();
        delete (userObject as Partial<IUser>).password;

        return userObject as IUser;
    }

    public async login(email: string, password: string): Promise<{ token: string }> {
        console.log(`[Service] Tentativa de login para: ${email}`);

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            console.error(`[Service] Erro: Usuário não encontrado ou sem senha: ${email}`);
            throw new Error('Credenciais inválidas.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error(`[Service] Erro: Senha inválida para: ${email}`);
            throw new Error('Credenciais inválidas.');
        }


        const payload = { id: user.id };

        if (!JWT_SECRET || !JWT_EXPIRES_IN) {
            throw new Error('Variáveis de ambiente JWT não estão definidas!');
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        console.log(`[Service] Login bem-sucedido e token gerado para: ${email}`);
        return { token };
    }
}

export default new AuthService();


