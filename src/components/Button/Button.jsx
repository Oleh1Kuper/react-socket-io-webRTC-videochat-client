import React from 'react';
import './Button.css';

function Button({ children, onClickHandler }) {
  return (
    <button type="button" className="button" onClick={onClickHandler}>
      {children}
    </button>
  );
}

export default Button;
