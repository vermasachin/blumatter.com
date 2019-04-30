import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const StyledTitle = styled.h2`
  padding: 10px 50px;
  margin: 0;
  color: ${props => (props.dark ? 'white' : '#1c2730')};
  text-align: ${props => (props.centered ? 'center' : 'left')};
`;

const Title = props => {
  return (
    <StyledTitle centered={props.centered} dark={props.dark}>
      {props.children}
    </StyledTitle>
  );
};

Title.propTypes = {
  centered: PropTypes.bool,
  children: PropTypes.string
};

export default Title;
