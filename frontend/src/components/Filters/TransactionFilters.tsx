import { useState } from 'react';
import { Container, Input, Select, FilterButton } from './styles';

interface IFilterValues {
    search: string;
    startDate: string;
    endDate: string;
    minValue: string;
    maxValue: string;
    status: string;
    cpfToSend: string;
}

interface ITransactionFiltersProps {
    onApplyFilters: (filters: IFilterValues) => void;
    isAdmin: boolean;
}

export default function TransactionFilters({ onApplyFilters, isAdmin }: ITransactionFiltersProps) {
    const [inputValue, setInputValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [cpfInput, setCpfInput] = useState('');
    const [status, setStatus] = useState('');

    const handleApply = () => {
        onApplyFilters({
            search: inputValue,
            startDate: startDate,
            endDate: endDate,
            minValue: minValue,
            maxValue: maxValue,
            status: status,
            cpfToSend: cpfInput
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    return (
        <Container>
            {isAdmin && (

                <div>
                    <label htmlFor="cpfFilter">CPF:</label>
                    <Input
                        id="cpfFilter"
                        placeholder='Filtre por CPF'
                        value={cpfInput}
                        onChange={(e) => setCpfInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            )}

            <div>
                <label htmlFor="description">Descrição:</label>
                <Input
                    id="description"
                    placeholder='Filtre por Descrição'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>


            <div>
                <label htmlFor="startDate">De:</label>
                <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="endDate">Até:</label>
                <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="minValue">Valor Mínimo:</label>
                <Input
                    id="minValue"
                    type="number"
                    placeholder="R$ 0,00"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div>
                <label htmlFor="maxValue">Valor Máximo:</label>
                <Input
                    id="maxValue"
                    type="number"
                    placeholder="R$ 1.000,00"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div>
                <label htmlFor="status">Status:</label>
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                    <option value="Em avaliação">Em avaliação</option>
                </Select>
            </div>

            <FilterButton onClick={handleApply}>Filtrar</FilterButton>
        </Container>
    );
}