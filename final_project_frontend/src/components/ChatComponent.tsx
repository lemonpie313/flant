import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useChatContext } from '.././context/ChatContext';

const ChatComponent: React.FC = () => {
  const { messages, addMessage } = useChatContext();
  const [inputMessage, setInputMessage] = React.useState('');

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

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">{msg}</div>
        ))}
      </ScrollArea>
      <div className="p-4 flex">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-grow mr-2"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatComponent;
