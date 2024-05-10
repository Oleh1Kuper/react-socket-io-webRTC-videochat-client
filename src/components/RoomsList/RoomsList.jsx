import React from 'react';
import { useSelector } from 'react-redux';
import RoomsListItem from '../RoomsListItem/RoomsListItem';
import './RoomsList.css';

function RoomsList() {
  const { groupCallRooms } = useSelector((state) => state.dashboard);
  return (
    <>
      {groupCallRooms.map((room) => (
        <RoomsListItem key={room.roomId} room={room} />
      ))}
    </>
  );
}

export default RoomsList;
