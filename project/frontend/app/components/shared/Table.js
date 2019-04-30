import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

// Can be used later
const Table = styled.table``;

const Thead = styled.thead``;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  color: white;
  background: ${props => (props.index % 2 === 0 ? '#1c2730' : '#293640')};
`;

const Th = styled.th`
  padding: 9px 24px;
  text-align: center;
`;

const Td = styled.td`
  padding: 6px 24px;
  text-align: center;
`;

const DataTable = props => {
  const { data, error, loading } = props;
  return (
    <>
      <Table>
        <Tbody>
          {error && (
            <Tr>
              <Td colSpan={8}>Error loading data..</Td>
            </Tr>
          )}
          {loading && (
            <Tr>
              <Td colSpan={8}>Loading.....</Td>
            </Tr>
          )}
          {!loading && !error && !data && (
            <Tr>
              <Td colSpan={8}>No data found.....</Td>
            </Tr>
          )}
          {!error && !loading && (
            <>
              <Tr>
                <Td>Name: </Td>
                <Td>{data.name}</Td>
              </Tr>
              <Tr>
                <Td>Brief: </Td>
                <Td>{data.brief}</Td>
              </Tr>
              <Tr>
                <Td>Industry: </Td>
                <Td>{data.industry}</Td>
              </Tr>
              <Tr>
                <Td>Skills: </Td>
                <Td>{data.skills}</Td>
              </Tr>
            </>
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default DataTable;
