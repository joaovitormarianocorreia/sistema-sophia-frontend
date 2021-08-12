import styled from 'styled-components'

export const ButtonWrapper = styled.button`
  padding: 10px;
  color: white;

  &.default {
    background-color: ${({ theme }) => theme.colors.blue};

    :hover {
      background-color: ${({ theme }) => theme.colors.lightBlue};
    }
  }

  &.danger {
    background-color: ${({ theme }) => theme.colors.red};

    :hover {
      background-color: ${({ theme }) => theme.colors.lightRed};
    }
  }

  &.neutral {
    background-color: #ccc;
    color: ${({ theme }) => theme.colors.blue};
  }
`
