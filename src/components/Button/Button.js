import React from 'react';
import './Button.css';

function Button(props) {
  let style;

  if (props.disabled) {
    style = { background: 'grey' };
  }

  return (
    <button className={`button`} style={style} disabled={props.disabled}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {props.label}
    </button>
  );
}

export default Button;
