import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from 'components/header'
import Home from './pages/home'
import Student from './pages/student'
import Responsible from './pages/responsible'
import Address from './pages/address'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/student" component={Student} />
        <Route path="/responsible" component={Responsible} />
        <Route path="/address" component={Address} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
