import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { endpoint } from '../../constants';
import AddProject from './AddProject';
import ViewProject from './ViewProject';
import Header from '../shared/Header';
import Title from '../shared/Title';
import Form from '../shared/Form';
import Label from '../shared/Label';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Wrapper from '../shared/Wrapper';
import Panel from '../shared/Panel';
import PanelWrap from '../shared/PanelWrap';

class ClientDashboard extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>Blumatter - Client Dashboard</title>
        </Helmet>
        <Wrapper>
          <Header>test</Header>
          <Switch>
            <Route path='/client-dashboard' exact component={AddProject} />
            <Route
              path='/client-dashboard/view-project/:name'
              exact
              component={ViewProject}
            />
          </Switch>
        </Wrapper>
      </>
    );
  }
}

export default ClientDashboard;
