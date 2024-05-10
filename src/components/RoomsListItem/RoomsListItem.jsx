import React from 'react';
import { joinGroupCall } from '../../utils/webRTCGroupCallHandler';

function RoomsListItem({ room }) {
  const handleClick = () => {
    console.log('join 6');
    joinGroupCall(room.socketId, room.roomId);
  };

  return (
    <div
      aria-hidden="true"
      onClick={handleClick}
      className="group_calls_list_item background_main_color"
    >
      <span>{room.hostName}</span>
    </div>
  );
}

export default RoomsListItem;
