import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  // background: #1c2730;
  margin: 0 auto;
  padding: 0 24px;
  width: 1200px;
`;

const Wrapper = props => {
  return <StyledWrapper>{props.children}</StyledWrapper>;
};

export default Wrapper;
