import { SignIn } from 'phosphor-react'
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"
import { Container, Header, Input, Label, Box, DivButton, Data, Button, SameLine } from '../../../styles/form'

export default function Register() {

    const [user, setUser] = useState({})
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            await register(user as any);
        } catch (error) {
            console.error("Erro no cadastro:", error);
        }

        setLoading(false);
    }

    return (

        <Container>

            <Box>

                <Header>

                    <h1> <SignIn size={35} /> Faça seu Cadastro</h1>
                    <h2>Entre com suas informações de cadastro</h2>

                </Header>

                <form onSubmit={handleSubmit}>

                    <Data>
                        <Label htmlFor="name">Nome</Label>
                        <Input type="name" name="name" id='name' placeholder="Digite o seu nome" onChange={handleOnChange} />
                        <br />

                        <Label htmlFor="cpf">CPF do Titular</Label>
                        <Input type="text" maxLength={11} name="cpf" id='cpf' placeholder="Digite o CPF do Titular do CNPJ" onChange={handleOnChange} />
                        <br />

                        <Label htmlFor="email">E-mail</Label>
                        <Input type="email" name="email" id='email' placeholder="Digite o email para cadastro" onChange={handleOnChange} />
                        <br />

                        <Label htmlFor="password" >Senha</Label>
                        <Input type="password" name="password" id='password' placeholder="Digite sua senha" onChange={handleOnChange} />
                        <br />

                        <Label htmlFor="confirmPassword" >Confirme sua senha</Label>
                        <Input type="password" name="confirmPassword" id='confirmPassword' placeholder="Digite sua senha" onChange={handleOnChange} />
                        <br />

                        <SameLine>
                            <Label htmlFor="isAdmin" >É Administrador?</Label>
                            <input type="checkbox" name="isAdmin" id='isAdmin' onChange={handleOnChange} />
                        </SameLine>

                        <br />

                    </Data>

                    <DivButton>

                        <Button type="submit" disabled={loading}>{!loading ? "Cadastre-se" : "Realizando login..."}</Button>

                    </DivButton>

                </form>

            </Box>

        </Container>

    )

}
