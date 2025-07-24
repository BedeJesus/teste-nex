import { Routes, Route } from "react-router";
import { Container } from "./styles"
import Home from "../Home/Home";
import Login from "../User/Login/Login";
import Register from "../User/Register/Register";
import UploadFile from "../UploadFile/UploadFile";
import Wallet from "../Wallet/Wallet";

export default function Content() {

    return (

        <Container>

            <Routes>
                <Route path="/" caseSensitive={false} element={<Home />} />
                <Route path="/login" caseSensitive={false} element={<Login />} />
                <Route path="/register" caseSensitive={false} element={<Register />} />
                <Route path="/upload" caseSensitive={false} element={<UploadFile />} />
                <Route path="/wallet" caseSensitive={false} element={<Wallet />} />
            </Routes>

        </Container>
    )

}

