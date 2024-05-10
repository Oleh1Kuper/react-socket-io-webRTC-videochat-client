import { callStates } from '../constants';
import { actions as callActions } from '../features/call';
import * as socketConnection from '../socket/socket';
import store from '../store/store';
import { getTurnServers } from './TURN.JS';

let myPeer = null;
let myPeerId = null;
let groupCallRoomId = null;
let groupCallHost = false;

const { dispatch } = store;

export const connectWithMyPeer = () => {
  myPeer = new window.Peer(undefined, {
    config: {
      iceServers: [...getTurnServers(), { url: 'stun:stun.1und1.de:3478' }],
    },
  });

  myPeer.on('open', (id) => {
    myPeerId = id;
  });

  myPeer.on('call', (call) => {
    const { localStream, groupCallStreams } = store.getState().call;

    call.answer(localStream);
    call.on('stream', (incommingStream) => {
      const stream = groupCallStreams.find((s) => s.id === incommingStream.id);

      if (!stream) {
        addVideoStream(incommingStream);
      }
    });
  });
};

export const createNewGroupCall = () => {
  groupCallHost = true;
  const { username } = store.getState().dashboard;

  socketConnection.registerGroupCall({
    username,
    peerId: myPeerId,
  });

  dispatch(callActions.setIsGroupCall(true));
  dispatch(callActions.setCallState(callStates.IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId) => {
  const { localStream } = store.getState().call;

  groupCallRoomId = roomId;

  socketConnection.joinUserToGroupCall({
    hostSocketId,
    roomId,
    peerId: myPeerId,
    streamId: localStream.id,
  });

  dispatch(callActions.setIsGroupCall(true));
  dispatch(callActions.setCallState(callStates.IN_PROGRESS));
};

export const leaveGroupCall = () => {
  if (groupCallHost) {
    socketConnection.groupCallClosesByHost({
      peerId: myPeerId,
    });
  } else {
    const { localStream } = store.getState().call;

    socketConnection.userLeftGroupCall({
      streamId: localStream.id,
      roomId: groupCallRoomId,
    });
  }

  clearGroupData();
};

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = false;
  dispatch(callActions.resetGroupCallData());
  myPeer.destroy();
  connectWithMyPeer();

  const { localStream } = store.getState().call;

  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};

export const removeInectiveStream = (data) => {
  const { groupCallStreams } = store.getState().call;
  const filterStreams = groupCallStreams.filter(
    (stream) => stream.id !== data.streamId,
  );

  dispatch(callActions.setGroupCallStreams(filterStreams));
};

export const connectToNewUser = (data) => {
  const { localStream, groupCallStreams } = store.getState().call;
  const call = myPeer.call(data.peerId, localStream);

  call.on('stream', (incommingStream) => {
    const stream = groupCallStreams.find((s) => s.id === incommingStream.id);

    if (!stream) {
      addVideoStream(incommingStream);
    }
  });
};

const addVideoStream = (incommingStream) => {
  const { groupCallStreams } = store.getState().call;

  dispatch(
    callActions.setGroupCallStreams([...groupCallStreams, incommingStream]),
  );
};

export const checkActiveGroupCall = () => {
  const { isGroupCall } = store.getState().call;

  return isGroupCall ? groupCallRoomId : false;
};
