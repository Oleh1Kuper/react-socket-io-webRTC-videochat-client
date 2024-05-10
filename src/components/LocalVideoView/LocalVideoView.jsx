import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './LocalVideoView.css';

function LocalVideoView() {
  const { localStream } = useSelector((state) => state.call);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      const video = localVideoRef.current;

      video.srcObject = localStream;
      video.onloadedmatadata = () => {
        video.play();
      };
    }
  }, [localStream]);

  return (
    <div className="background_secondary_color videoContainer">
      <video ref={localVideoRef} autoPlay muted className="videoElement" />
    </div>
  );
}

export default LocalVideoView;
