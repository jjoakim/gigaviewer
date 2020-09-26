import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { Home } from './pages/index';

import './App.css';

const App = () => {
  return (
    <Switch>
      <div className="App">
        <Route exact path="/" component={Home} />
      </div>
    </Switch>
  );
}

export default App;
