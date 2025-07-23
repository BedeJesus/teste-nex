import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import Transaction from '../models/Transaction';

import createUserToken from '../helpers/create-user-token';
import getToken from '../helpers/get-token';
import getUserbyToken from '../helpers/get-user-by-token';
import { where } from 'sequelize';
import { cp } from 'fs';


export default class UserController {
    static async register(req: Request, res: Response) {
        const { name, email, password, confirmPassword, cpf, isAdmin } = req.body;

        if (!name) {
            return res.status(422).json({ message: 'O nome é obrigatório' });
        }
        if (!email) {
            return res.status(422).json({ message: 'O e-mail é obrigatório' });
        }
        if (!cpf) {
            return res.status(422).json({ message: 'O CPF é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ message: 'A senha é obrigatória' });
        }
        if (password != confirmPassword) {
            return res.status(422).json({ message: 'As senhas não conferem' });
        }
        if (isAdmin !== undefined && typeof isAdmin !== 'boolean') {
            return res.status(422).json({ message: 'O status de administrador é inválido.' });
        }

        const cpfOnlyNumbers = cpf.replace(/[^\d]/g, '');
        if (cpfOnlyNumbers.length !== 11) {
            return res.status(422).json({ message: 'CPF inválido.' });
        }

        const userByEmail = await User.findOne({ where: { email } });
        if (userByEmail) {
            return res.status(422).json({
                message: 'E-mail já cadastrado. Por favor, utilize outro.',
            });
        }

        const userByCpf = await User.findOne({ where: { cpf: cpfOnlyNumbers } });
        if (userByCpf) {
            return res.status(422).json({ message: 'CPF já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            const newUser = await User.create({
                name,
                email,
                password: passwordHash,
                cpf: cpfOnlyNumbers,
                isAdmin: isAdmin,
            });


            await createUserToken(newUser, req, res);

        } catch (error) {
            res.status(500).json({ message: 'Erro no servidor', error });
        }
    }


    static async login(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'Faltando E-mail' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'Faltando senha' })
            return
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(422).json({ message: 'Não existe usuario com esse email' })
            return
        }

        //check if password matches with email
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida' })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req: Request, res: Response) {
        let currentUser;

        if (req.headers.authorization) {
            const token = getToken(req);
            currentUser = await getUserbyToken(token);
        } else {
            currentUser = null;
        }

        if (!currentUser) {
            return res.status(401).json({ message: 'Acesso negado!' });
        }

        res.status(200).json(currentUser);
    }

    static async getWalletValue(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(422).json({ message: 'ID de usuário inválido.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        await console.log(await Transaction.findAll({ where: { cpf: user.cpf } }));
        console.log(user.cpf)

        try {

            const totalPoints = await Transaction.sum('value', {
                where: {
                    cpf: user.cpf,
                    status: 'Aprovado'
                }
            });

            res.status(200).json({
                walletValue: totalPoints.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) || 0
            });
        } catch (error) {
            console.error("Erro ao buscar saldo da carteira:", error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor' });
        }
    }


}
