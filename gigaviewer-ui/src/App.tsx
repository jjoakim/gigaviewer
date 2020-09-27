import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { Home, Login } from './pages/index';
import { TopNavbar } from './components/top-navbar';

import './App.css';

const App = () => {
  return (
    <Switch>
      <div className="App">
        <TopNavbar></TopNavbar>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
      </div>
    </Switch>
  );
}

export default App;
