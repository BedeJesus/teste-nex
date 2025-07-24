import styled from "styled-components";

export const Container = styled.div`

  margin: 0 5%;

    h3{
        margin-left: auto;
        margin-right: auto;
        color:${props => props.theme.colors.primary_text};
    }

    h1{
      color: ${props => props.theme.colors.primary_text};
      margin-bottom: .5em;
    }

    label{
      color: ${props => props.theme.colors.primary_text};
      font-size: 1.2em;
      margin-right: .5em;
      
    }

`

export const Items = styled.div`

  display: flex;
  flex-wrap: wrap;
  justify-content:flex-start;
  
`