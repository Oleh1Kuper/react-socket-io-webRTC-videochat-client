import React, { useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import ActiveUsersList from '../components/ActiveUsersList/ActiveUsersList';
import DashboardInformation from '../components/DashboardInformation/DashboardInformation';
import DirectCall from '../components/DirectCall/DirectCall';
import GroupCall from '../components/GroupCall/GroupCall';
import RoomsList from '../components/RoomsList/RoomsList';
import { connectWithMyPeer } from '../utils/webRTCGroupCallHandler';
import { getLocalStream } from '../utils/webRTCHandler';
import { setTurnServers } from '../utils/TURN.JS';
import '../styles/Dashboard.css';

function Dashboard() {
  useEffect(() => {
    axios
      .get('https://socket-io-webrtc-videochat-server.onrender.com/api/get-turn-credentials')
      .then(({ data }) => {
        setTurnServers(data.token.iceServers);
        getLocalStream();
        connectWithMyPeer();
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="dashboard_container background_main_color">
      <div className="dashboard_left_section">
        <div className="dashboard_content_container">
          <DirectCall />
          <GroupCall />
          <DashboardInformation />
        </div>

        <div className="dashboard_rooms_container background_secondary_color">
          <RoomsList />
        </div>
      </div>

      <div className="dashboard_right_section background_secondary_color">
        <div className="dashboard_active_users_list">
          <ActiveUsersList />
        </div>

        <div className="dashboard_logo_container">
          <img className="dashboard_logo_image" alt="logo" src={logo} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
