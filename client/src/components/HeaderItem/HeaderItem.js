import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderItem = (props) => {
  return (
    <NavLink
      {...props}
    >
      {
        props.icon &&
          <img style={{marginRight: 5}} src={`/images/navbar/${props.icon}.svg`} />
      }
      {props.text}
      {props.children}
    </NavLink>
  )
};

export default HeaderItem;