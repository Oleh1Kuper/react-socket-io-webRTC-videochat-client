import React, { useRef, useEffect } from 'react';

function GroupCallVideo({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    const remoteGroupCallVideo = videoRef.current;

    remoteGroupCallVideo.srcObject = stream;
    remoteGroupCallVideo.onloadedmetadata = () => {
      remoteGroupCallVideo.play();
    };
  }, [stream]);

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <video ref={videoRef} autoPlay width="100%" height="100%">
        <track kind="captions" srcLang="en" label="English" />
      </video>
    </div>
  );
}

export default GroupCallVideo;
