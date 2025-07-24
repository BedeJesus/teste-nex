import { Status, Container, Content, Description, Title } from './styles'
import type ITransaction from "../../types/ITransaction";

export default function Produto(props: ITransaction) {

    return (

        <Container>
            <Title>{props.cpf}</Title>

            <Content>

                <Description>
                    <p>{props.description} </p>
                    <p>Data da transação: {props.transactionDate}</p>
                    <p>Valor da transação em pontos: {props.valueInPoint} </p>
                    <p>Valor da transação: {props.value}</p>
                </Description>

                <Status>
                    {props.status}
                </Status>

            </Content>

        </Container>

    )
}


