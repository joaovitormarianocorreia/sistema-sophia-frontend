import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.blue};
  width: 60%;
  margin: 10px auto;

  .form-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .form-footer {
    display: flex;
    flex-flow: row-reverse;
  }
`

export const Content = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.nude};
  padding: 25px;
  flex: 1;
  flex-direction: column;
  border-radius: 5px;

  .form-control {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;

    > input:not([type='date']),
    select {
      padding: 5px;
    }

    > input[type='date'] {
      padding: 3px;
    }

    > span {
      color: ${({ theme }) => theme.colors.red};
    }
  }

  & > table {
    width: 100%;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.blue};
    border-collapse: collapse;
    text-align: center;

    th,
    td > button {
      padding: 5px;

      :hover {
        color: white;
        background-color: ${({ theme }) => theme.colors.lightBlue};
      }
    }

    th {
      font-weight: initial;
      color: white;
      background-color: ${({ theme }) => theme.colors.blue};
    }

    tbody > tr:nth-child(odd) {
      background-color: lightgray;
    }

    & input[type='checkbox'] {
      cursor: pointer;
    }
  }
`
export const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0 0 2px;

  & button {
    padding: 10px;
    width: 100%;
    color: ${({ theme }) => theme.colors.nude};
    background-color: ${({ theme }) => theme.colors.blue};

    &:first-child {
      border-top-right-radius: 5px;
    }

    &:last-child {
      border-bottom-right-radius: 5px;
    }

    &.active {
      color: ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.nude};
    }

    &:not(.active):hover {
      background-color: ${({ theme }) => theme.colors.lightBlue};
    }
  }
`
