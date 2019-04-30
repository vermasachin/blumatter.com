import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { endpoint } from '../../constants';
import Button from './Button';
import P from './Paragraph';

const StyledHeader = styled.nav`
  display: flex;
  justify-content: space-between;
  background: #1c2730;
  padding: 18px 50px;
  border-bottom: 4px solid #2b3842;
`;

const Logo = styled.h1`
  font-size: 24px;
  padding: 0;
  margin: 0;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const Ul = styled.ul`
  display: flex;
  justify-content: flex-end;
  line-height: 1;
  color: white;
  list-style: none;
  position: relative;
  float: left;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

const Dropdown = styled(Ul)`
  display: none;
  position: absolute;
  background: #1c2730;
  top: 100%;
  right: 18px;
  padding: 0;
  ${Ul}:hover & {
    display: block;
  }
`;

const Li = styled.li`
  display: block;
  text-decoration: none;
  font-weight: 700;
  line-height: 32px;
  padding: 0 10px;
  ${props =>
    props.sub &&
    css`
      float: none;
      width: 90px;
      text-align: right;
    `}
`;

const Header = props => {
  const logout = () => {
    axios
      .get(`${endpoint}/logout`)
      .then(response => {
        localStorage.clear();
        props.history.push('/');
      })
      .catch(error => {
        toast.error(error.data.error || error.response.error);
      });
  };

  const name = localStorage.getItem('name');

  return (
    <StyledHeader>
      <Logo>Blumatter</Logo>
      <P>
        {name}
        <Button primary onClick={logout}>
          Logout
        </Button>
      </P>
    </StyledHeader>
  );
};

export default withRouter(Header);
