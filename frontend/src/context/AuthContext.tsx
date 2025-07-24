import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useFlashMessage from '../hooks/useFlashMessage';
import type { IUser } from '../types/IUser';

export type User = IUser;

interface AuthContextType {
    authenticated: boolean;
    user: User | null;
    loading: boolean;
    register: (user: IUser) => Promise<void>;
    login: (user: IUser) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;

                api.get('/users/checkuser').then(response => {
                setUser(response.data);
                setAuthenticated(true);
            }).catch(() => {
                    logout();
                    });
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);
    
    async function register(user: IUser) {
        let msgText = 'Cadastro realizado com sucesso!';
        let msgType = 'success';

        try {
            const data = await api
                .post('/users/register', user)
                .then(response => response.data);
            await authUser(data);
        } catch (error: any) {
            msgText = error.response.data.message;
            msgType = 'error';
        }
        setFlashMessage(msgText, msgType);
    }

    async function login(user: IUser) {
        let msgText = 'Login realizado com sucesso';
        let msgType = 'success';

        try {
            const data = await api
                .post('/users/login', user)
                .then(response => response.data);
            await authUser(data);
        } catch (error: any) {
            msgText = error.response.data.message;
            msgType = 'error';
        }

        setFlashMessage(msgText, msgType);
    }

    async function authUser(data: { message: string; token: string; user?: User }) {
        setAuthenticated(true)

        if (data.user) {
            setUser(data.user);
        }

        localStorage.setItem('token', JSON.stringify(data.token))

        api.defaults.headers.Authorization = `Bearer ${data.token}`;
        navigate('/')
    }

    function logout() {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'

        setAuthenticated(false)
        setUser(null);
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = null;
        navigate('/')

        setFlashMessage(msgText, msgType)
    }

    const value = { authenticated, user, loading, register, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
