import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'

import { GlobalStyle } from 'styles/global'
import DefaultTheme from 'styles/themes/default'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultTheme}>
      <App />
      <GlobalStyle />
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
