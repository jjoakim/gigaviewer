import React from 'react';

import { Home, Viewer } from './pages';
import { TopNavbar } from './components/top-navbar';
import { Route, Switch, useLocation } from 'react-router-dom';

import './App.css';

const App = () => {
  return (
    <Switch>
      <div className="App">
        <TopNavbar isViewerMode={useLocation().pathname === '/viewer'}></TopNavbar>
        <Route exact path="/" component={Home} />
        {/**
          * uncomment for more routes + uncoment TopNavbar.tsx menu items 
        */}
        {/* <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/upload" component={Upload} /> */}
        <Route 
          path="/viewer/:groupId/:frame" 
          component={Viewer}
        />
      </div>
    </Switch>
  );
};

export default App;
