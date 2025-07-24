import { Container, Button } from './styles';
import type { IUser } from '../../types/IUser';

interface PaginationProps {
    itensInPage: number;
    totalItens: number;
    paginate: (pageNumber: number) => void;
    user: IUser | null;
}

export default function Pagination({ itensInPage, totalItens, paginate, user }: PaginationProps) {

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItens / itensInPage); i++) {
        pageNumbers.push(i);
    }

    return (

        <nav>
            <Container>
                {user &&

                    pageNumbers.map(number => (

                        <div key={number} >
                            <Button onClick={() => paginate(number)}  >
                                {number}
                            </Button>
                        </div>
                    ))
                }

            </Container>
        </nav>

    )
}

