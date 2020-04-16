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
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, role) => {
    console.log(`role: ${role}`);
    console.log(`token: ${token}`);
    if(role === 1){
      setIsAdmin(true);
    }
    setToken(token);
    setUserId(uid);
    
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

  let routes;

  // Make another route for logged in users that are not admin to see the cart
  if (isAdmin) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop" exact>
          <Shop />
        </Route>
        <Route path="/admin" exact>
          <Admin />
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
        <Redirect to="/auth" />
      </Switch>
    );
  }

  // Wrap Auth Context to parts of our application that wants to use it
  // Provider takes a value prop which we bind to a new value.
  // Whenever that value changes, components that listen for it will re-render
  // !! is used on token to return something truthy or falsey
  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        isAdmin: isAdmin }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
