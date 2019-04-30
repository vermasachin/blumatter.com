import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { endpoint } from '../../constants';
import { toast } from 'react-toastify';
import Title from '../shared/Title';
import Button from '../shared/Button';
import Form from '../shared/Form';
import Input from '../shared/Input';
import Label from '../shared/Label';
import Panel from '../shared/Panel';
import PanelWrap from '../shared/PanelWrap';
import P from '../shared/Paragraph';
import A from '../shared/Link';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  login = e => {
    const { name } = this.state;
    e.preventDefault();
    axios
      .post(`${endpoint}/login`, {
        name
      })
      .then(response => {
        localStorage.setItem('name', response.data.data.name);
        response.data.ok
          ? this.props.history.push(`/client-dashboard`)
          : toast.error(response.data.error);
      })
      .catch(error => {
        console.log(error);
        // toast.error(error.response.data.error || error.response.data);
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name } = this.state;

    return (
      <>
        <Helmet>
          <title>Blumatter Login</title>
        </Helmet>
        <PanelWrap>
          <Panel>
            <Title centered>Blumatter - Login</Title>
            <Form onSubmit={this.login}>
              <Label>Name</Label>
              <Input
                type='text'
                name='name'
                value={name}
                onChange={e => this.handleChange(e)}
                required
              />
              <Button primary type='submit'>
                Login
              </Button>
            </Form>

            <P>Need an account?</P>
            <P>
              <A to='/client-register/'>Register as a Client</A>
              {'  '}OR{'  '}
              <A to='/expert-register/'> Register as an expert</A>
            </P>
          </Panel>
        </PanelWrap>
      </>
    );
  }
}

export default Login;
