import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';
import { endpoint } from '../../constants';
import { Link, withRouter } from 'react-router-dom';
import Title from '../shared/Title';
import Button from '../shared/Button';
import Form from '../shared/Form';
import Input from '../shared/Input';
import Label from '../shared/Label';
import Panel from '../shared/Panel';
import PanelWrap from '../shared/PanelWrap';
import P from '../shared/Paragraph';
import A from '../shared/Link';

class ClientRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: ''
    };
  }

  register = e => {
    const { name, email, phone } = this.state;
    e.preventDefault();
    axios
      .post(`${endpoint}/client`, { name, email, phone })
      .then(response => {
        if (response.data.ok) {
          this.props.history.push('/client-dashboard');
          toast.success('Registered Successfully.');
        } else {
          toast.error(response.data.error || 'Error Registering');
        }
      })
      .catch(error => {
        // toast.error(error.data.error);
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, phone, email } = this.state;
    return (
      <>
        <Helmet>
          <title>Blumatter - Client Register</title>
        </Helmet>
        <PanelWrap>
          <Panel>
            <Title centered>Register as a Client</Title>
            <Form onSubmit={this.register}>
              <Label>Name</Label>
              <Input
                type='text'
                name='name'
                value={name}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Email</Label>
              <Input
                type='email'
                name='email'
                value={email}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Phone</Label>
              <Input
                type='number'
                name='phone'
                value={phone}
                onChange={e => this.handleChange(e)}
                required
              />
              <Button primary type='submit'>
                Register
              </Button>
            </Form>

            <P>
              Already registered? <A to='/'>Login</A>
            </P>
          </Panel>
        </PanelWrap>
      </>
    );
  }
}

export default ClientRegister;
