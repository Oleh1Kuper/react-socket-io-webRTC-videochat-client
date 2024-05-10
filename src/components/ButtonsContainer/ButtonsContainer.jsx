import React from 'react';
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdVideoLabel,
  MdCamera,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { actions as callActions } from '../../features/call';
import Button from '../Button/Button';
import './ButtonsContainer.css';
import {
  hangUp,
  switchForScreenSharingStream,
} from '../../utils/webRTCHandler';

function ButtonsContainer() {
  const {
    localStream,
    isMicroEnabled,
    isCameraEnabled,
    isSharedScreen,
    isGroupCall,
  } = useSelector((state) => state.call);
  const dispatch = useDispatch();

  const toggleMute = () => {
    localStream.getAudioTracks()[0].enabled = !isMicroEnabled;
    dispatch(callActions.enableMicro(!isMicroEnabled));
  };

  const toggleCamera = () => {
    localStream.getVideoTracks()[0].enabled = !isCameraEnabled;
    dispatch(callActions.enableCamera(!isCameraEnabled));
  };

  const toggleShareScreen = () => {
    switchForScreenSharingStream();
  };

  const handleHangUp = () => {
    hangUp();
  };

  return (
    <div className="buttonContainer">
      <Button onClickHandler={toggleMute}>
        {isMicroEnabled ? (
          <MdMic className="icon" />
        ) : (
          <MdMicOff className="icon" />
        )}
      </Button>

      {!isGroupCall && (
        <Button onClickHandler={handleHangUp}>
          <MdCallEnd className="icon" />
        </Button>
      )}

      <Button onClickHandler={toggleCamera}>
        {isCameraEnabled ? (
          <MdVideocam className="icon" />
        ) : (
          <MdVideocamOff className="icon" />
        )}
      </Button>

      {!isGroupCall && (
        <Button onClickHandler={toggleShareScreen}>
          {isSharedScreen ? (
            <MdCamera className="icon" />
          ) : (
            <MdVideoLabel className="icon" />
          )}
        </Button>
      )}
    </div>
  );
}

export default ButtonsContainer;
