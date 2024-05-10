import React, { useEffect } from 'react';
import './CallRejectedDialog.css';
import { useDispatch } from 'react-redux';
import { actions as callActions } from '../../features/call';

function CallRejectedDialog({ reason }) {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(callActions.setCallRejected({ reason: null, isRejected: false }));
    }, 4000);
  }, [dispatch]);

  return (
    <div className="call_rejected_dialog background_secondary_color">
      <span>{reason}</span>
    </div>
  );
}

export default CallRejectedDialog;
