import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatContext } from '../context/ChatContext';
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { X } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { communityApi } from "../services/api"; // 커뮤니티 API 추가

import './ChatComponent.scss';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3000';

interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

interface Community {
  communityId: number;
  communityName: string;
}

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const ChatComponent: React.FC = () => {
  const { messages, addMessage } = useChatContext();
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userId = getUserIdFromToken(token);
      setUserId(userId);
      fetchUserCommunities(userId);
    }

    const newSocket = io(REACT_APP_BACKEND_API_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchUserCommunities = async (userId: string | null) => {
    if (!userId) return;
    try {
      const response = await communityApi.findMy();
      setCommunities(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user communities:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('msgToClient', (payload: ChatMessage) => {
      addMessage(`${payload.userId}: ${payload.message}`);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.off('msgToClient');
      socket.off('connect_error');
    };
  }, [socket, addMessage]);

  const joinRoom = (communityId: number) => {
    if (!socket || !userId) return;

    const newRoomId = `community_${communityId}`;
    setRoomId(newRoomId);
    setSelectedCommunity(communityId);
    socket.emit('joinRoom', { roomId: newRoomId, userId });
  };

  const leaveRoom = () => {
    if (!socket || !roomId || !userId) return;

    socket.emit('leaveRoom', { roomId, userId });
    setRoomId(null);
    setSelectedCommunity(null);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket && roomId && userId) {
      const payload: ChatMessage = {
        roomId,
        userId,
        message: inputMessage,
        timestamp: new Date(),
      };
      socket.emit('msgToServer', payload);
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
    if (isChatOpen && roomId) {
      leaveRoom();
    }
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
          {!selectedCommunity ? (
            <div className="community-selection">
              <h4>채팅할 커뮤니티를 선택하세요:</h4>
              {communities.map((community) => (
                <button key={community.communityId} onClick={() => joinRoom(community.communityId)}>
                  {community.communityName}
                </button>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
