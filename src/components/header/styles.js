import styled from 'styled-components'

export const Wrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background-color: ${({ theme }) => theme.colors.nude};
  color: ${({ theme }) => theme.colors.blue};

  ul {
    display: flex;
    list-style: none;

    li {
      padding: 5px;
    }

    li + li {
      margin-left: 5px;
    }
  }
`
