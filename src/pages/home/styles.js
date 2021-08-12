import styled from 'styled-components'
import { Content as ParentContent } from 'pages/student/styles'

export const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  width: 50%;
  padding: 25px;
  margin: 10px auto;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.nude};

  .header {
    margin-bottom: 15px;
  }
`

export const Content = styled(ParentContent)``
