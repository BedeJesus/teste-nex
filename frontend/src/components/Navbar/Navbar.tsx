import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { Top, Container, Button, Store, MiddleButtons, Logo } from './styles'
import Switch from "react-switch";
import SubNavBar from "../SubNavBar/SubNavBar";
import { ThemeContext } from 'styled-components'
import { Sun, Moon } from 'phosphor-react';

interface NavBarProps {
    toggleTheme: () => void;
}

export default function NavBar({ toggleTheme }: NavBarProps) {

    const themeContext = useContext(ThemeContext);
    const title = themeContext?.title ?? '';
    const { authenticated, logout, loading, user } = useAuth();


    return (
        <Container>

            <Top>

                <SubNavBar />

                <Store to='/'>Home <Logo size={35} /> </Store>

                {!loading && (
                    authenticated ? (
                        <MiddleButtons>
                            <Button to='/wallet'>Carteira</Button>
                            {user?.isAdmin && (<Button to='/upload'>Upload</Button>)}
                            <Button to='/' onClick={logout}>Sair</Button>
                        </MiddleButtons>
                    ) : (
                        <MiddleButtons>
                            <Button to='/login'>Login</Button>
                            <Button to='/register'>Cadastro</Button>
                        </MiddleButtons>
                    )
                )}

                <Switch
                    onChange={toggleTheme}
                    checked={title === 'dark'}
                    uncheckedIcon={<Sun size={26} />}
                    checkedIcon={<Moon size={28} />}
                    onColor={'#FFFF00'}
                />

            </Top>

        </Container>

    )
}