import React from 'react';
import { FaPhoneSlash } from 'react-icons/fa6';
import Button from '../Button/Button';
import { hangUp } from '../../utils/webRTCHandler';
import './CallingDialog.css';

function CallingDialog() {
  const handleHangUp = () => {
    hangUp();
  };

  return (
    <div className="direct_calling_dialog background_secondary_color">
      <span>Calling</span>
      <Button onClickHandler={handleHangUp}>
        <FaPhoneSlash className="icon" />
      </Button>
    </div>
  );
}

export default CallingDialog;
