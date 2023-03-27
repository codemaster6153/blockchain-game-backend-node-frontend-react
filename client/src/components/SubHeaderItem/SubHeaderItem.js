import React from 'react';
import './SubHeaderItem.css';

const SubHeaderItem = (props) => {
  return (
      <div {...props} className="subHeaderItem">
        <img src={`/images/navbar/${props.icon}.svg`} />
        <li {...props}>
          {props.text}
        </li>
      </div>
  )
};

export default SubHeaderItem;