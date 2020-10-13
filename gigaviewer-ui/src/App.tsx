import React from 'react';

import { About, Home, Login, Signup, Upload } from './pages';
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
        <Route path="/signup" component={Signup} />
        <Route path="/upload" component={Upload} />
      </div>
    </Switch>
  );
};

export default App;
