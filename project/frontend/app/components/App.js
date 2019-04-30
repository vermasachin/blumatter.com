import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './Landing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientDashboard from './client/Dashboard';
import ExpertDashboard from './expert/Dashboard';

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path='/client-dashboard' component={ClientDashboard} />
          <Route path='/expert-dashboard' component={ExpertDashboard} />
          <Route path='/' component={Landing} />
        </Switch>
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
