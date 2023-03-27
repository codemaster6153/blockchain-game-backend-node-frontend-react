import React from 'react';
import './Navigation.css'
import { NavLink } from 'react-router-dom';


function NavGames() {
  return (
    <div className='abs-dropdown'>
        <NavLink to={"/endless-siege"} className={`navbar-item menu-item`}>{"Endless Siege"}</NavLink>
        <hr style={{margin: '0px'}} />
        <NavLink to={"/candy-fiesta"} className={`navbar-item menu-item`}>{"Candy Fiesta"}</NavLink>
        <hr style={{margin: '0px'}} />
        <NavLink to={"/templok"} className={`navbar-item menu-item`}>{"Templok"}</NavLink>
        <hr style={{margin: '0px'}} />
        <NavLink to={"/ringy-dingy"} className={`navbar-item menu-item`}>{"RingyDingy"}</NavLink>
        <hr style={{margin: '0px'}} />
        <NavLink to={"/rug-pool"} className={`navbar-item menu-item`}>{"Rug Pool"}</NavLink>
    </div>
);
}

export default NavGames;
