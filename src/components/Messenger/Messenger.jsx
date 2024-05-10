import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageDisplayer from './MessageDisplayer';
import { sendMessageWithDatachannel } from '../../utils/webRTCHandler';
import { actions } from '../../features/call';
import './Messenger.css';

function Messenger() {
  const { message } = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnKeyDownEvent = (e) => {
    if (e.keyCode === 13) {
      sendMessageWithDatachannel(inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (message.received) {
      setTimeout(() => {
        dispatch(
          actions.setChatMessage({
            received: false,
            content: '',
          }),
        );
      }, 3000);
    }
  }, [dispatch, message.received]);

  return (
    <>
      <input
        className="messages_input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleOnKeyDownEvent}
        placeholder="Type your message"
      />
      {message.received && <MessageDisplayer message={message.content} />}
    </>
  );
}

export default Messenger;
