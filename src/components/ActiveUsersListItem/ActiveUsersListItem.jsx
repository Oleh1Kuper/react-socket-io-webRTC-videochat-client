import React from 'react';
import { useSelector } from 'react-redux';
import userAvatar from '../../assets/userAvatar.png';
import { callStates } from '../../constants';
import { callToOtherUser } from '../../utils/webRTCHandler';

function ActiveUsersListItem({ user }) {
  const { username } = user;
  const { callState } = useSelector((state) => state.call);

  const handleListItemPressed = () => {
    if (callState === callStates.AVAILABLE) {
      callToOtherUser(user);
    }
  };

  return (
    <div
      aria-hidden="true"
      className="active_user_list_item"
      onClick={handleListItemPressed}
    >
      <div className="active_user_list_image_container">
        <img
          className="active_user_list_image"
          alt="user avatar"
          src={userAvatar}
        />
      </div>
      <span className="active_user_list_text">{username}</span>
    </div>
  );
}

export default ActiveUsersListItem;
