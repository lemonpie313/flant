import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { X } from 'lucide-react';

import './ChatComponent.scss';

const ChatComponent: React.FC = () => {
  const { messages, addMessage } = useChatContext();
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // 기본값을 false로 설정

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-container">
      {!isChatOpen && (
        <button className="chat-toggle-button" onClick={toggleChat}>
          채팅 열기
        </button>
      )}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>채팅</h3>
            <button onClick={toggleChat}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <ScrollArea className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">{msg}</div>
            ))}
          </ScrollArea>
          <div className="chat-input">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="chat-input-field"
            />
            <button onClick={handleSendMessage}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
