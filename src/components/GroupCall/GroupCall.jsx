import React from 'react';
import { useSelector } from 'react-redux';
import RoomButton from '../RoomButton/RoomButton';
import { callStates } from '../../constants';
import { createNewGroupCall, leaveGroupCall } from '../../utils/webRTCGroupCallHandler';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';

function GroupCall() {
  const { localStream, callState, isGroupCall } = useSelector(
    (state) => state.call,
  );
  const isShownButton = localStream
    && callState !== callStates.IN_PROGRESS
    && !isGroupCall;

  return (
    <div>
      {isShownButton && (
        <RoomButton handleClick={createNewGroupCall}>Create room</RoomButton>
      )}
      {isGroupCall && <GroupCallRoom />}
      {isGroupCall && <RoomButton handleClick={leaveGroupCall}>Leave room</RoomButton>}
    </div>
  );
}

export default GroupCall;
