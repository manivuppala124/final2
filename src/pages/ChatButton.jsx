// ChatButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChatScreen from './ChatScreen';
import './ChatButton.css';

function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleClickOutside = (event) => {
    if (chatRef.current && !chatRef.current.contains(event.target)) {
      setIsChatOpen(false);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  return (
    <div>
      <div className="chat-button" onClick={toggleChat}>
        💬
      </div>
      {isChatOpen && (
        <div className="chat-popup" ref={chatRef}>
          <ChatScreen />
        </div>
      )}
    </div>
  );
}

export default ChatButton;
