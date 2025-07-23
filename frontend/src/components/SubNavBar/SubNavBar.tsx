import { useState, useRef } from 'react'
import { useAuth } from "../../context/AuthContext";
import { Container, Box, Options, Button } from './styles'

export default function SubNavBar() {

    const [show, setShow] = useState(false);
    const { authenticated, logout, user } = useAuth();

    const labelRef = useRef<HTMLLabelElement>(null);

    const handleClick = () => {
        if (labelRef.current) {
            labelRef.current.click();
        }
    };

    return (

        <Container>

            <label ref={labelRef} htmlFor="burger" className="burger" >
                <input id="burger" type="checkbox" onClick={() => show ? setShow(false) : setShow(true)} />
                <span></span>
                <span></span>
                <span></span>
            </label>

            {show && (

                <Box>

                    {authenticated ? (
                        <Options>

                            <Button to='/wallet'>Carteira</Button>
                            {user?.isAdmin && (<Button to='/upload'>Upload</Button>)}
                            <Button to='/' onClick={logout}>Sair</Button>

                        </Options>

                    ) : (

                        <Options>

                            <Button to='/login' onClick={handleClick}>Login</Button>
                            <Button to='/register' onClick={handleClick}>Cadastro</Button>

                        </Options>

                    )}

                </Box>
            )}

        </Container>
    )
}