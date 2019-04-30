import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ClientRegister from './Auth/ClientRegister';
import ExpertRegister from './Auth/ExpertRegister';
import Login from './Auth/Login';

const Landing = props => {
  return (
    <>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/client-register' exact component={ClientRegister} />
        <Route path='/expert-register' exact component={ExpertRegister} />
      </Switch>
    </>
  );
};

export default Landing;
