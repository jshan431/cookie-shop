import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Admin from './user/pages/Admin';
import Shop from './shop/pages/Shop';
import Cart from './shop/pages/Cart'
import Home from './user/pages/Home';
import NewItem from './shop/pages/NewItem';
import CategoryItems from './shop/pages/CategoryItems';
import UpdateItem from './shop/pages/UpdateItem';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import SingleItem from './shop/pages/SingleItem';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop" exact>
          <Shop />
        </Route>
        <Route path="/cart/:userId" exact>
          <Cart />
        </Route>
        <Route path="/:categoryId/items" exact>
          <CategoryItems />
        </Route>
        <Route path="/item/:itemId" exact>
          <SingleItem />
        </Route>
        <Route path="/items/new" exact>
          <NewItem />
        </Route>
        <Route path="/items/:itemId">
          <UpdateItem />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop" exact>
          <Shop />
        </Route>
        <Route path="/:categoryId/items" exact>
          <CategoryItems />
        </Route>
        <Route path="/item/:itemId" exact>
          <SingleItem />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
