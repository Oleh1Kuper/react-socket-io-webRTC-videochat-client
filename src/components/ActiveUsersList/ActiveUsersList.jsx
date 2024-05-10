import React from 'react';
import { useSelector } from 'react-redux';
import ActiveUsersListItem from '../ActiveUsersListItem/ActiveUsersListItem';
import './ActiveUsersList.css';

function ActiveUsersList() {
  const { activeUsers } = useSelector((state) => state.dashboard);
  return (
    <div className="active_user_list_container">
      {activeUsers.map((user) => (
        <ActiveUsersListItem key={user.socketId} user={user} />
      ))}
    </div>
  );
}

export default ActiveUsersList;
