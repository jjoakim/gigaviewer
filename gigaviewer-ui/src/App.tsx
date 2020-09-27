import React from 'react';

import { About, Home, Login } from './pages/index';
import { TopNavbar } from './components/top-navbar';
import { Route, Switch } from 'react-router-dom';

import './App.css';

const App = () => {
  return (
    <Switch>
      <div className="App">
        <TopNavbar></TopNavbar>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
      </div>
    </Switch>
  );
}

export default App;
