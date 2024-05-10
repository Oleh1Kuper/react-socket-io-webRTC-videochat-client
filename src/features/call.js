import { createSlice } from '@reduxjs/toolkit';
import { callStates } from '../constants';

const initialState = {
  localStream: null,
  remoteStream: null,
  callState: callStates.UNAVAILABLE,
  isDialogVisible: false,
  callerName: null,
  callRejected: {
    isRejected: false,
    reason: null,
  },
  isMicroEnabled: true,
  isCameraEnabled: true,
  isSharedScreen: false,
  isGroupCall: false,
  groupCallStreams: [],
  message: {
    received: false,
    content: '',
  },
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setCallState: (state, action) => {
      state.callState = action.payload;
    },
    setCallerName: (state, action) => {
      state.callerName = action.payload;
    },
    setIsDialogVisible: (state, action) => {
      state.isDialogVisible = action.payload;
    },
    setCallRejected: (state, action) => {
      state.callRejected = action.payload;
    },
    enableMicro: (state, action) => {
      state.isMicroEnabled = action.payload;
    },
    enableCamera: (state, action) => {
      state.isCameraEnabled = action.payload;
    },
    shareScreen: (state, action) => {
      state.isSharedScreen = action.payload;
    },
    resetCallState: (state) => {
      state.remoteStream = null;
      state.callerName = null;
      state.isSharedScreen = false;
      state.isDialogVisible = false;
      state.isCameraEnabled = true;
      state.isMicroEnabled = true;
    },
    setIsGroupCall: (state, action) => {
      state.isGroupCall = action.payload;
    },
    setGroupCallStreams: (state, action) => {
      state.groupCallStreams = action.payload;
    },
    resetGroupCallData: (state) => {
      state.groupCallStreams = [];
      state.isGroupCall = false;
      state.callState = callStates.AVAILABLE;
      state.isCameraEnabled = true;
      state.isMicroEnabled = true;
    },
    setChatMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export default callSlice.reducer;

export const { actions } = callSlice;
