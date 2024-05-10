import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard';
import calldReducer from '../features/call';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    call: calldReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoreActions: [
        'call/setLocalSteram',
        'call/setRemoteSteram',
        'call/setGroupCallStreams',
      ],
      ignoredPaths: [
        'call.remoteStream',
        'call.localStream',
        'call.groupCallStreams',
      ],
    },
  }),
});

export default store;
