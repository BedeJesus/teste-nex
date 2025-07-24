import { Container, Box } from './styles'
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from 'react';
import api from '../../utils/api'

export default function Wallet() {

    const { user } = useAuth();
    const [walletValue, setWalletValue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (user && user.id) {
            api.get(`/users/wallet/${user.id}`).then((response) => {
                setWalletValue(response.data.walletValue)
                setLoading(false)
            }).catch((error) => {
                console.error("Erro ao obter o saldo da carteira");
                setLoading(false);
            });
        }

    }, [user])

    return (
        <Container>

            {loading ? (
                <Box>
                    <p>Carregando...</p>
                </Box>
            ) : (
                <Box>
                    <p>Seu saldo é de:</p>
                    <h1>Saldo: R$ {walletValue || '0,00'}</h1>
                    <p>Com base nas transações aprovadas com o seu CPF</p>
                </Box>
            )}

        </Container>
    )
}