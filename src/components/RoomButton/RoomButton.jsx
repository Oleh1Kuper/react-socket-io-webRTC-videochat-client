import React from 'react';
import './RoomButton.css';

function RoomButton({ children, handleClick }) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="group_call_button"
    >
      {children}
    </button>
  );
}

export default RoomButton;
