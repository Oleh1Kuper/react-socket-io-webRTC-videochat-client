import { callAnswer, callStates } from '../constants';
import { actions as callActions } from '../features/call';
import * as socketConnection from '../socket/socket';
import store from '../store/store';
import { getTurnServers } from './TURN.JS';

let connectedUserSocketId = null;
let peerConnection = null;
let screenSharingStream = null;
let dataChannel = null;

const { dispatch } = store;

const createPeerConnection = () => {
  const turnServers = getTurnServers();
  const peerConfig = {
    iceServers: [...turnServers, { url: 'stun:stun.1und1.de:3478' }],
    iceTransportPolicy: 'relay',
  };

  peerConnection = new RTCPeerConnection(peerConfig);

  const { localStream } = store.getState().call;

  for (const track of localStream.getTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.ontrack = ({ streams: [stream] }) => {
    dispatch(callActions.setRemoteStream(stream));
  };

  peerConnection.ondatachannel = (event) => {
    const datachannel = event.channel;

    datachannel.onmessage = (event) => {
      dispatch(callActions.setChatMessage({
        received: true,
        content: event.data,
      }));
    };
  };

  dataChannel = peerConnection.createDataChannel('chat');

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socketConnection.sendWebRTCCandidate({
        candidate: event.candidate,
        connectedUserSocketId,
      });
    }
  };
};

const sendOffer = async () => {
  try {
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    socketConnection.sendWebRTCOffer({
      calleeSocketId: connectedUserSocketId,
      offer,
    });
  } catch (error) {
    console.error(error);
  }
};

export const handleOffer = async (data) => {
  try {
    await peerConnection.setRemoteDescription(data.offer);

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    socketConnection.sendWebRTCAnswer({
      callerSocketId: connectedUserSocketId,
      answer,
    });
  } catch (error) {
    console.error(error);
  }
};

export const handleAnswer = async (data) => {
  try {
    await peerConnection.setRemoteDescription(data.answer);
  } catch (error) {
    console.error(error);
  }
};

export const handleCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (error) {
    console.error(error);
  }
};

export const getLocalStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 480,
        height: 360,
      },
    });

    dispatch(callActions.setLocalStream(stream));
    dispatch(callActions.setCallState(callStates.AVAILABLE));
    createPeerConnection();
  } catch (error) {
    console.error(error);
  }
};

export const callToOtherUser = (calleeDetails) => {
  connectedUserSocketId = calleeDetails.socketId;
  dispatch(callActions.setCallState(callStates.IN_PROGRESS));
  dispatch(callActions.setIsDialogVisible(true));
  socketConnection.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().dashboard.username,
    },
  });
};

export const handlePreOffer = (data) => {
  if (checkIfCallIsPossible()) {
    connectedUserSocketId = data.callerSocketId;
    dispatch(callActions.setCallerName(data.callerUserName));
    dispatch(callActions.setCallState(callStates.REQUESTED));
  } else {
    socketConnection.sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: callAnswer.NOT_AVAILABLE,
    });
  }
};

export const acceptIncomingCallRequest = () => {
  socketConnection.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: callAnswer.ACCEPTED,
  });

  dispatch(callActions.setCallState(callStates.IN_PROGRESS));
};

export const handlePreOfferAnswer = (data) => {
  dispatch(callActions.setIsDialogVisible(false));

  const { answer } = data;

  if (answer === callAnswer.ACCEPTED) {
    sendOffer();

    return;
  }

  const reasons = {
    [callAnswer.NOT_AVAILABLE]:
      'Callee is not able to pick up the call right now',
    default: 'Call rejected by the callee',
  };

  const reason = reasons[answer] || reasons.default;

  dispatch(
    callActions.setCallRejected({
      reason,
      rejected: true,
    }),
  );
  resetCallData();
};

export const rejectIncomingCallRequest = () => {
  socketConnection.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: callAnswer.REJECTED,
  });

  resetCallData();
};

export const checkIfCallIsPossible = () => {
  const { call } = store.getState();
  const condition = !call.localStream || call.callState !== callStates.AVAILABLE;

  return !condition;
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  dispatch(callActions.setCallState(callStates.AVAILABLE));
};

export const switchForScreenSharingStream = async () => {
  const { isSharedScreen, localStream } = store.getState().call;

  if (!isSharedScreen) {
    try {
      screenSharingStream = await navigator
        .mediaDevices.getDisplayMedia({ video: true });
      dispatch(callActions.shareScreen(true));

      const senders = peerConnection.getSenders();
      const sender = senders
        .find((s) => s.track.kind === screenSharingStream.getVideoTracks()[0].kind);

      sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
    } catch (error) {
      console.error(error);
    }
  } else {
    const senders = peerConnection.getSenders();
    const sender = senders
      .find((s) => s.track.kind === localStream.getVideoTracks()[0].kind);

    sender.replaceTrack(localStream.getVideoTracks()[0]);
    dispatch(callActions.shareScreen(false));

    screenSharingStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};

export const handleUserHangUp = () => {
  resetCallDataAfterHangUp();
};

export const hangUp = () => {
  socketConnection.sendUserHangUp({ connectedUserSocketId });
  resetCallDataAfterHangUp();
};

const resetCallDataAfterHangUp = () => {
  const { isSharedScreen, localStream } = store.getState().call;

  if (isSharedScreen) {
    screenSharingStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  dispatch(callActions.resetCallState());
  peerConnection.close();
  peerConnection = null;
  createPeerConnection();
  resetCallData();

  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};

export const sendMessageWithDatachannel = (message) => {
  dataChannel.send(message);
};
