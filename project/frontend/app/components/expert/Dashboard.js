import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Title from '../shared/Title';

const ExpertDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Blumatter - Expert Dashboard</title>
      </Helmet>
      <Title dark>History</Title>
    </>
  );
};

export default ExpertDashboard;
