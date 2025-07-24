import React from "react";
import { SignIn } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from "../../../context/AuthContext"
import { Container, Data, Header, Input, Label, Footer, Button, Box } from '../../../styles/form'

export default function Login() {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            await login(user as any);
        } catch (error) {
            console.error("Erro no login:", error);
        }

        setLoading(false);
    }

    return (

        <Container>

            <Box>

                <Header>
                    <h1>{<SignIn size={30} />}  Faça seu Login</h1>
                    <h2>Entre com suas informações de login</h2>
                </Header>

                <form onSubmit={handleSubmit}>

                    <Data>
                        <Label htmlFor="email">E-mail</Label>
                        <Input type="email" name="email" placeholder="Digite seu e-mail" onChange={handleChange} />
                        <br />

                        <Label htmlFor="senha" >Senha</Label>
                        <Input type="password" name="password" placeholder="Digite sua senha" onChange={handleChange} />
                        <br />
                    </Data>

                    <Footer>

                        <Button type="submit" disabled={loading}>{!loading ? "Entrar" : "Realizando login..."}</Button>
                        <h6>Não tem uma conta? <Link to='/register'>Registre-se</Link></h6>

                    </Footer>

                </form>

            </Box>

        </Container>

    )

}
