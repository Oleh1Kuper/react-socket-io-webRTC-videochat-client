import React from 'react';
import { useSelector } from 'react-redux';
import { callStates } from '../../constants';
import './DashboardInformation.css';

function DashboardInformation() {
  const {
    dashboard: { username },
    call: { callState },
  } = useSelector((state) => state);

  if (callState === callStates.IN_PROGRESS) {
    return null;
  }

  return (
    <div className="dashboard_info_text_container">
      <span className="dashboard_info_text_title">
        {`Hello ${username} welcome in VideoTalker.`}
      </span>
      <span className="dashboard_info_text_description">
        You can start a call calling directy to a person from the list or you
        can create or join group call.
      </span>
    </div>
  );
}

export default DashboardInformation;
