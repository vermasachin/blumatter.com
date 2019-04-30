import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
// import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';
import { endpoint } from '../../constants';
import { Link } from 'react-router-dom';
import Title from '../shared/Title';
import Button from '../shared/Button';

const PanelWrap = styled.div`
  margin: 0 auto;
  width: 420px;
  height: 100vh;
  justify-content: center;
  flex-direction: column;
  display: flex;
`;

const Panel = styled.div`
  border-radius: 6px;
  background: #1c2730;
  padding: 24px 36px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.label`
  margin: 0 0 4px 0;
  display: block;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  color: #e3e3e3;
`;

const Input = styled.input`
  padding: 10px;
  border: #222;
  border-radius: 6px;
  margin-bottom: 20px;
  width: 100%;
`;

const P = styled.p`
  margin: 8px 0;
  font-size: 0.8rem;
  color: white;
`;

const A = styled(Link)`
  color: #0275d8;
  text-decoration: none;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = e => {
    e.preventDefault();
    axios
      .post(
        `${endpoint}/api/users/login`,
        {
          email,
          password
        },
        { withCredentials: true }
      )
      .then(function(response) {
        localStorage.setItem('name', response.data.name);
        props.history.push(`/dashboard`);
      })
      .catch(function(error) {
        toast.error(error.response.data.error || error.response.data);
      });
  };

  return (
    <>
      <Helmet>
        <title>Blumatter Login</title>
      </Helmet>
      <PanelWrap>
        <Panel>
          <Title centered>Blumatter - Login</Title>
          <Form onSubmit={login}>
            <Label>Email</Label>
            <Input
              type='email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Label>Password</Label>
            <Input
              type='password'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            <A to='/expert-register/'>Register as an expert.</A>
          </P>
        </Panel>
      </PanelWrap>
    </>
  );
};

export default Login;
