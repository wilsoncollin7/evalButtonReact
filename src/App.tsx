import * as React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// styling
import './App.css';
// bootstrap
import { Col, Container } from 'react-bootstrap';
// utils
import UserProvider from './utils/contexts';
// components
import Evals from './components/health/partials/evals';
// import EvalDetailsPage from './components/health/partials/evalDetails/evalDetailsPage';
import { UserConfig } from './components/userConfig/userConfig';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Container fluid>
        <Col>
        {/* comment out when production */}
          <UserConfig>
        {/* --------------------------- */}
            <Router>
              <Switch>
                <Route path='/:projectNumber/evals'><Evals /></Route>
                {/* <Route path='/:projectNumber/eval/:permitNumber'><EvalDetailsPage /></Route> */}
                <Route path='/'>
                  <h1>NO PROJECT NUMBER</h1>
                </Route>
              </Switch>
            </Router>
          </UserConfig>
        </Col>
      </Container>
    </UserProvider>
  );
}

export default App;
