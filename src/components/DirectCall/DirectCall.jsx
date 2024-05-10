import React from 'react';
import { useSelector } from 'react-redux';
import LocalVideoView from '../LocalVideoView/LocalVideoView';
import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import IncomingCallDialog from '../IncomingCallDialog/IncomingCallDialog';
import CallRejectedDialog from '../CallRejectedDialog/CallRejectedDialog';
import CallingDialog from '../CallingDialog/CallingDialog';
import { callStates } from '../../constants';
import ButtonsContainer from '../ButtonsContainer/ButtonsContainer';
import Messenger from '../Messenger/Messenger';

function DirectCall() {
  const {
    remoteStream,
    callState,
    isDialogVisible,
    callRejected,
  } = useSelector((state) => state.call);

  return (
    <>
      <LocalVideoView />
      {remoteStream && <RemoteVideoView />}
      {callRejected.rejected && <CallRejectedDialog reason={callRejected.reason} /> }
      {callState === callStates.REQUESTED && <IncomingCallDialog /> }
      {isDialogVisible && <CallingDialog />}
      {remoteStream && <ButtonsContainer />}
      {remoteStream && callState === callStates.IN_PROGRESS && <Messenger />}
    </>
  );
}

export default DirectCall;
