import React from 'react';
import { NavLink } from 'react-router-dom';
const NavLinks = () => {
  return(
    <ul>
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/shop">
          Shop
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth">
          Authenticate
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;