import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  background: ${props => (props.primary ? '#0275d8' : '#1c2730')};
  border: ${props => (props.primary ? 'none' : '1px solid #0275d8')};
  border-radius: 5px;
  color: ${props => (props.primary ? 'white' : '#0275d8')};
  font-size: 14px;
  padding: ${props => (props.primary ? '10px 20px' : '9px 20px;')};
  text-transform: capitalize;
  cursor: pointer;
  margin: 5px;
`;

const Button = props => {
  return (
    <StyledButton primary={props.primary} onClick={props.onClick}>
      {props.children}
    </StyledButton>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;
