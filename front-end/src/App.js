import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Home from './home/pages/Home';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Shop from './shop/pages/Shop';
import Auth from './user/pages/Auth';

import './App.css';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop" exact>
          <Shop />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
