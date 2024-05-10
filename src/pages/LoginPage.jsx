import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions } from '../features/dashboard';
import * as socketConnection from '../socket/socket';
import logo from '../assets/logo.png';
import '../styles/LoginPage.css';

function LoginPage() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePress = () => {
    socketConnection.registerNewUser(userName);
    dispatch(actions.setUserName(userName));
    navigate('/dashboard');
  };

  useEffect(() => {
    socketConnection.connectWithSocket();
  }, []);

  return (
    <div className="login-page_container background_main_color">
      <div className="login-page_login_box background_secondary_color">
        <div className="login-page_logo_container">
          <img src={logo} alt="logo" className="login-page_logo_image" />
        </div>

        <div className="login-page_title_container ">
          <h1>Get on Board</h1>
        </div>

        <div className="login-page_title_container">
          <input
            value={userName}
            onChange={handleChange}
            type="text"
            placeholder="Enter your name"
            className="login-page_input background_main_color text_main_color"
          />
        </div>

        <div className="login-page_button_container ">
          <button
            disabled={!userName.trim()}
            onClick={handlePress}
            type="button"
            className="login-page_button text_main_color background_main_color"
          >
            Start Using VideoTalker
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
