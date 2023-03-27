import React from 'react';
import './DropDown.css';

const DropDwon = (props) => {
  return (
    <div className='abs-dropdown-container'>
      <div className='abs-dropdown-header'>
        <img src={`/images/navbar/info.svg`} />
        {props.text}
      </div>
      {props.children}
    </div>
  )
};

export default DropDwon;