import React from 'react';
import { useSelector } from 'react-redux';
import ButtonsContainer from '../ButtonsContainer/ButtonsContainer';
import GroupCallVideo from '../GroupCallVideo/GroupCallVideo';
import './GroupCallRoom.css';

function GroupCallRoom() {
  const { groupCallStreams } = useSelector((state) => state.call);
  const uniqueStreams = Array.from(new Set(groupCallStreams));

  return (
    <div className="group_call_room_container">
      <span className="group_call_title">Group Call</span>

      <div className="group_call_videos_container">
        {uniqueStreams.map((stream) => (
          <GroupCallVideo stream={stream} key={stream.id} />
        ))}
      </div>

      <ButtonsContainer />
    </div>
  );
}

export default GroupCallRoom;
