import { useState } from "react";
import { Container, Header, Input, Label, Box, DivButton, Data, Button } from "../../styles/form";
import api from '../../utils/api';
import useFlashMessage from '../../hooks/useFlashMessage';
import { useAuth } from "../../context/AuthContext";

export default function UploadFile() {

    const [file, setFile] = useState<File | null>(null);
    const { setFlashMessage } = useFlashMessage();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        if (target.files && target.files.length > 0) {
            setFile(target.files[0]);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        let msgText = '';
        let msgType: 'success' | 'error' = 'success';

        if (!file) {
            setLoading(false);
            setFlashMessage('Por favor, selecione um arquivo.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('sheet', file);
        formData.append('userId', String(user?.id));

        try {

            await api.post('/transactions/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((response) => {
                msgText = response.data.message;
            });

        } catch (error: unknown) {

            msgType = 'error';
            if (error && typeof error === 'object' && 'response' in error) {
                msgText = (error as any).response?.data?.message || "Ocorreu um erro ao enviar o arquivo.";
            } else {
                msgText = "Ocorreu um erro ao enviar o arquivo.";
            }
        }
        setLoading(false);
        setFlashMessage(msgText, msgType);
    }

    return (

        <Container>

            <Box>

                <Header>

                    <h1>Faça o upload do arquivo</h1>
                    <h2>Adicione o arquivo excel</h2>

                </Header>

                <form onSubmit={handleSubmit}>

                    <Data>
                        <Label htmlFor="sheet">Arquivo (.xlsx)</Label>
                        <Input type="file" name="sheet" id='sheet' accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleOnChange} />
                        <br />

                    </Data>

                    <DivButton>

                        <Button type="submit" disabled={loading}>{!loading ? "Enviar" : "Enviando..."}</Button>

                    </DivButton>

                </form>

            </Box>

        </Container>

    )

}
