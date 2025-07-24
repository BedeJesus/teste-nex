import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Container, Items } from './styles'
import api from "../../utils/api"
import Card from "../Card/Card";
import Pagination from "../Pagination/Pagination";
import type ITransaction from "../../types/ITransaction";
import TransactionFilters from '../Filters/TransactionFilters';

interface ITransactionsResponse {
    transactions: ITransaction[];
    totalPages: number;
    currentPage: number;
}

interface IFilterValues {
    search: string;
    startDate: string;
    endDate: string;
    minValue: string;
    maxValue: string;
    status: string;
    cpfToSend: string;
}

export default function Home() {

    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        startDate: '',
        endDate: '',
        minValue: '',
        maxValue: '',
        status: '',
        cpfToSend: ''
    });

    const { user } = useAuth();

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const applyFilters = (filters: IFilterValues) => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    }

    useEffect(() => {
        const fetchTransactions = async () => {

            const cpf = !user?.isAdmin ? user?.cpf.replace(/[^\d]/g, '') : null;
            let cpfToSend: string | null = null;

            if (user) {
                if (user.isAdmin) {
                    cpfToSend = appliedFilters.cpfToSend.replace(/[^\d]/g, '');
                } else {
                    cpfToSend = user.cpf.replace(/[^\d]/g, '');
                }
            }

            setLoading(true);

            try {
                const { data } = await api.get<ITransactionsResponse>('/transactions', {
                    params: {
                        page: currentPage,
                        cpf: cpf,
                        cpfToSend: cpfToSend,
                        search: appliedFilters.search,
                        startDate: appliedFilters.startDate,
                        endDate: appliedFilters.endDate,
                        minValue: appliedFilters.minValue,
                        maxValue: appliedFilters.maxValue,
                        status: appliedFilters.status
                    }
                });
                setTransactions(data.transactions);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Falha ao buscar transações:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTransactions();
        } else {
            setTransactions([]);
            setLoading(false);
        }
        
    }, [currentPage, appliedFilters, user]);


    return (

        <Container>
            <h1>Lista de Transações</h1>

            {!user ? (
                <h3>Você precisa estar logado para visualizar as transações</h3>
            ) : (
                <TransactionFilters
                    isAdmin={!!user?.isAdmin}
                    onApplyFilters={applyFilters}
                />
            )}

            {!loading ? (

                <>
                    <Items>

                        {transactions.length > 0 &&
                            transactions.map((transaction) => (

                                <Card
                                    id={transaction.id}
                                    key={transaction.id}
                                    cpf={transaction.cpf}
                                    description={transaction.description}
                                    transactionDate={transaction.transactionDate}
                                    valueInPoint={transaction.valueInPoint}
                                    value={transaction.value}
                                    status={transaction.status}
                                />

                            ))}

                        {!transactions.length && user && (
                            <h3>Não há transações cadastradas com o seu CPF</h3>
                        )}

                    </Items>

                     <Pagination itensInPage={15}
                        totalItens={totalPages * 15}
                        paginate={paginate}
                        user={user}
                    />
                </>
                
            ) : (

                <h1>Carregando...</h1>

            )}

        </Container>

    )
}
