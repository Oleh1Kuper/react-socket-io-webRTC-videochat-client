import io from 'socket.io-client';
import store from '../store/store';
import { actions as dashboardActions } from '../features/dashboard';
import {
  handleAnswer,
  handleCandidate,
  handleOffer,
  handlePreOffer,
  handlePreOfferAnswer,
  handleUserHangUp,
} from '../utils/webRTCHandler';
import {
  checkActiveGroupCall,
  clearGroupData,
  connectToNewUser,
  removeInectiveStream,
} from '../utils/webRTCGroupCallHandler';

const socket = io('https://socket-io-webrtc-videochat-server.onrender.com');
const broadcastTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
};

export const connectWithSocket = () => {
  socket.on('connection');

  socket.on('broadcast', (data) => {
    handleBroadcast(data);
  });

  socket.on('pre-offer', (data) => {
    handlePreOffer(data);
  });

  socket.on('pre-offer-answer', (data) => {
    handlePreOfferAnswer(data);
  });

  socket.on('webRTC-offer', (data) => {
    handleOffer(data);
  });

  socket.on('webRTC-answer', (data) => {
    handleAnswer(data);
  });

  socket.on('webRTC-candidate', (data) => {
    handleCandidate(data);
  });

  socket.on('user-hang-up', () => {
    handleUserHangUp();
  });

  socket.on('group-call-join-request', (data) => {
    connectToNewUser(data);
  });

  socket.on('group-call-user-left', (data) => {
    removeInectiveStream(data);
  });
};

export const registerNewUser = (username) => {
  socket.emit('register-new-user', { socketId: socket.id, username });
};

export const sendPreOffer = (data) => {
  socket.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
  socket.emit('pre-offer-answer', data);
};

export const sendWebRTCOffer = (data) => {
  socket.emit('webRTC-offer', data);
};

export const sendWebRTCAnswer = (data) => {
  socket.emit('webRTC-answer', data);
};

export const sendWebRTCCandidate = (data) => {
  socket.emit('webRTC-candidate', data);
};

export const sendUserHangUp = (data) => {
  socket.emit('user-hang-up', data);
};

export const registerGroupCall = (data) => {
  socket.emit('grop-call-register', data);
};

export const joinUserToGroupCall = (data) => {
  socket.emit('group-call-join-request', data);
};

export const userLeftGroupCall = (data) => {
  socket.emit('group-call-user-left', data);
};

export const groupCallClosesByHost = (data) => {
  socket.emit('group-call-closed-by-host', data);
};

function handleBroadcast({ data, event }) {
  switch (true) {
    case broadcastTypes.ACTIVE_USERS === event: {
      const usersExeptMe = data.filter((user) => user.socketId !== socket.id);

      store.dispatch(dashboardActions.setActiveUser(usersExeptMe));
      break;
    }

    case broadcastTypes.GROUP_CALL_ROOMS === event: {
      const groupCallRooms = data.filter((room) => room.socketId !== socket.id);
      const activeGroupCallRoomId = checkActiveGroupCall();

      if (activeGroupCallRoomId) {
        const room = groupCallRooms
          .find((room) => room.roomId === activeGroupCallRoomId);

        if (!room) {
          clearGroupData();
        }
      }

      store.dispatch(dashboardActions.setGroupRooms(groupCallRooms));
      break;
    }

    default:
      break;
  }
}
