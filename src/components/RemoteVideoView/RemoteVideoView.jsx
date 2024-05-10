import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './RemoteVideoView.css';

function RemoteVideoView() {
  const { remoteStream } = useSelector((state) => state.call);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteStream) {
      const video = remoteVideoRef.current;

      video.srcObject = remoteStream;
      video.onloadedmatadata = () => {
        video.play();
      };
    }
  }, [remoteStream]);

  return (
    <div className="video_container">
      <video ref={remoteVideoRef} className="videoElement" autoPlay>
        <track kind="captions" srcLang="en" label="English" />
      </video>
    </div>
  );
}

export default RemoteVideoView;
