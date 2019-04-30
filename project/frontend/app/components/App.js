import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './Landing';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Landing} />
      </Switch>
    </Router>
  );
};

export default App;
