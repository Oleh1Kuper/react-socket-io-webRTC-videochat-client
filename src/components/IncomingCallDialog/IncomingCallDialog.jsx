import React from 'react';
import { useSelector } from 'react-redux';
import {
  acceptIncomingCallRequest,
  rejectIncomingCallRequest,
} from '../../utils/webRTCHandler';
import './IncomingCallDialog.css';

function IncomingCallDialog() {
  const { callerName } = useSelector((state) => state.call);
  const handleAcceptButton = () => {
    acceptIncomingCallRequest();
  };

  const handleRejectButton = () => {
    rejectIncomingCallRequest();
  };

  return (
    <div className="direct_call_dialog background_secondary_color">
      <span className="direct_call_dialog_caller_name">{callerName}</span>

      <div className="direct_call_dialog_button_container">
        <button
          type="button"
          className="direct_call_dialog_accept_button"
          onClick={handleAcceptButton}
        >
          Accept
        </button>

        <button
          type="button"
          className="direct_call_dialog_reject_button"
          onClick={handleRejectButton}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default IncomingCallDialog;
