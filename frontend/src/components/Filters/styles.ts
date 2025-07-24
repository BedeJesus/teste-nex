import styled from "styled-components";


export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid ${props => props.theme.colors.secundary_details};
    border-radius: 10px;

    div {
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 0.5rem;
        font-size: 1.2em;
        color: ${props => props.theme.colors.primary_text};
    }
`;

export const Input = styled.input`
    padding: 0.5rem;
    background-color: transparent;
    border-color: ${props => props.theme.colors.secundary_details};

    border-top: transparent ;
    border-right: transparent ;
    border-left: transparent ;
    color: ${props => props.theme.colors.primary_text};

    &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: invert(1);
    }

    &::-webkit-datetime-edit {
        color: ${props => props.theme.colors.primary_text};
    }

    ::placeholder,
    ::-webkit-input-placeholder {
        color: ${props => props.theme.colors.primary_text} ;
    }

    &:focus {
        outline: none;
    }
`;

export const Select = styled.select`
    padding: 0.5rem;
    background-color: transparent;
    border-color: ${props => props.theme.colors.secundary_details};
    border: 1px solid ${props => props.theme.colors.secundary_details};
    color: ${props => props.theme.colors.primary_text};
    padding: 0.2em 0.1em;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;

    option {
        background-color: ${props => props.theme.colors.primary_background};
        color: ${props => props.theme.colors.primary_text};
    }

    &:focus {
        outline: none;
    }
`;

export const FilterButton = styled.button`
   padding: 0.5rem 1rem;
   border-radius: 10px;
   background-color: rgb(255, 56, 86);
   transition: all .3s ease;
   box-shadow: rgb(201, 46, 70) 0px 10px 0px 0px;
   color: hsl(0, 0%, 100%);
   margin: 0 0 0 .5em;
  
   &:hover {
      box-shadow: rgb(201, 46, 70) 0px 7px 0px 0px;
      cursor: pointer;
    }

   &:active {
      box-shadow: rgb(201, 46, 70) 0px 0px 0px 0px;
      transform: translateY(5px);
      transition: 50ms;
    }  
`;