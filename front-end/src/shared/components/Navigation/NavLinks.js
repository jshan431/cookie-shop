import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink to="/shop" exact>
          SHOP
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/cart/:userId">CART</NavLink>
        </li>
      )}
      {auth.isAdmin && (
      <li>
        <NavLink to="/admin" exact>
          Admin
        </NavLink>
      </li>
      )}
      {auth.isAdmin && (
        <li>
          <NavLink to="/items/new">ADD ITEM</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
