import styled from "styled-components";

export const Container = styled.div`

  display: flex;
  flex-direction: column;
  margin: 0 5%;

  color: ${props => props.theme.colors.primary_text};


  h1{
    font-size: 2em;
    margin-bottom: .7em;
  }
  
`

export const Box = styled.div`

  display: flex;
  flex-direction: column;
  height: 10em;
  margin-bottom: 2em;
  border-radius: 15px;
  background: ${props => props.theme.item.background};
  box-shadow: ${props => props.theme.item.box_shadow};
  justify-content: space-evenly;

  @media(max-width : 1400px) {
        flex-direction: column;
        align-items: center;
  } 

  @media(max-width : 800px) {
        height: 15em;
  } 

    p{
        font-size: 1.2em;
    }
`