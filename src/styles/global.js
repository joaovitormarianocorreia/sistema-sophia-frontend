import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Roboto';
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;

    &:visited {
      color: initial;
    }
  }


  button {
    border: none;
    background: none;
    font-size: 1em;
    :hover {
      cursor: pointer;
    }

    &.icon-button {
      color: ${({ theme }) => theme.colors.blue};
      font-size: 2em;
    }
  }
`
