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

const ClientRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const register = e => {
    e.preventDefault();
    axios
      .post(`${endpoint}/api/users/register`, { name, email, phone })
      .then(function(response) {
        localStorage.setItem('name', response.data.name);
        props.history.push(`/register/otp/${response.data.email}`);
      })
      .catch(function(error) {
        toast.error(error.response.data.error || error.response.data);
      });
  };

  return (
    <>
      <Helmet>
        <title>Bittmax - Client Register</title>
      </Helmet>
      <PanelWrap>
        <Panel>
          <Title centered>Bittmax</Title>
          <Form onSubmit={register}>
            <Label>Name</Label>
            <Input
              type='text'
              name='name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Label>Email</Label>
            <Input
              type='email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Label>Phone</Label>
            <Input
              type='number'
              name='phone'
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
};

export default ClientRegister;
