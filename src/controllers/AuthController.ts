// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const user = await AuthService.register(req.body);
            return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
        } catch (error: any) {
            if (error.message === 'E-mail já cadastrado.') {
                return res.status(409).json({ message: error.message }); // 409 Conflict
            } else if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Dados inválidos.', details: error.message });
            }
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
            }
            
            const { token } = await AuthService.login(email, password);
            return res.status(200).json({ token });
        } catch (error: any) {
            if (error.message === 'Credenciais inválidas.') {
                return res.status(401).json({ message: error.message }); // 401 Unauthorized
            }
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
}

export default new AuthController();