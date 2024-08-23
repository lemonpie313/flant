import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useChatContext } from '../context/ChatContext';
import RoomSelector from './RoomSelector';
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { X, SendIcon } from 'lucide-react';

interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
  fileUrl?: string;
  type?: 'message' | 'notification';
}

interface Community {
  communityId: number;
  communityName: string;
}

interface ChatWindowProps {
  socket: Socket | null;
  userId: string | null;
  communities: Community[];
  onClose: () => void;
  isManager: boolean; // 매니저 권한 확인
}

const ChatWindow: React.FC<ChatWindowProps> = ({ socket, userId, communities, onClose, isManager }) => {
  const { messages, addMessage } = useChatContext();
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  const joinRoom = (communityId: number) => {
    if (!socket || !userId) return;

    const newRoomId = `community_${communityId}`;
    setRoomId(newRoomId);
    setSelectedCommunity(communityId);
    socket.emit('joinRoom', { roomId: newRoomId, userId });
  };

  const createRoom = (communityName: string) => {
    if (!socket || !isManager) return;

    const newCommunityId = communities.length + 1; // 새 커뮤니티 ID 생성
    const newRoomId = `community_${newCommunityId}`;
    const newCommunity: Community = {
      communityId: newCommunityId,
      communityName,
    };

    // 서버에 방 생성 요청
    socket.emit('createRoom', newRoomId, (error: any) => {
      if (error) {
        console.error('Failed to create room:', error);
      } else {
        communities.push(newCommunity); // 로컬 상태 업데이트
        joinRoom(newCommunityId); // 생성된 방으로 바로 입장
      }
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !roomId || !userId) return;

    const payload: ChatMessage = {
      roomId,
      userId,
      message: inputMessage,
      timestamp: new Date(),
    };
    socket.emit('msgToServer', payload, (error: any) => {
      if (error) {
        console.error('Failed to send message:', error);
      } else {
        setInputMessage('');
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>채팅</h3>
        <button onClick={onClose}><X /></button>
      </div>
      {!selectedCommunity ? (
        <RoomSelector
          communities={communities}
          onSelectRoom={joinRoom}
          onCreateRoom={createRoom}
          isManager={isManager} // 매니저 권한 전달
        />
      ) : (
        <>
          <ScrollArea className="chat-messages">
            {messages
              .filter(msg => msg.roomId === roomId)
              .map((msg, index) => (
                <div key={index} className={`message ${msg.userId === userId ? 'outgoing' : 'incoming'}`}>
                  <strong>{msg.userId}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
          </ScrollArea>
          <div className="chat-input">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSendMessage}>
              <SendIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
