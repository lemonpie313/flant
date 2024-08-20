import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatContext } from '../context/ChatContext';
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { X, PaperclipIcon, SendIcon } from 'lucide-react';
import jwtDecode from "jwt-decode";
import { communityApi } from "../services/api";

import './ChatComponent.scss';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001';

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

const getToken = () => localStorage.getItem("accessToken");

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = (jwtDecode as any)(token);
    return decoded.sub || null;
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
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fixedImage, setFixedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeSocket = useCallback(() => {
    const token = getToken();
    if (!token) return;

    const newSocket = io(REACT_APP_BACKEND_API_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setError('채팅 중 오류가 발생했습니다.');
    });

    newSocket.on('msgToClient', (payload: ChatMessage) => {
      addMessage(payload);
    });

    newSocket.on('userJoined', (data) => {
      addMessage({ ...data, type: 'notification' });
    });

    newSocket.on('userLeft', (data) => {
      addMessage({ ...data, type: 'notification' });
    });

    newSocket.on('chatImage', (ImageMessage) => {
      addMessage(ImageMessage);
      setFixedImage(ImageMessage.fileUrl);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('error');
      newSocket.off('msgToClient');
      newSocket.off('userJoined');
      newSocket.off('userLeft');
      newSocket.off('chatImage');
      newSocket.close();
    };
  }, [addMessage]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userId = getUserIdFromToken(token);
      setUserId(userId);
      fetchUserCommunities(userId);
    }

    const cleanup = initializeSocket();

    return cleanup;
  }, [initializeSocket]);

  useEffect(() => {
    if (!socket) return;

    const checkConnection = setInterval(() => {
      if (!socket.connected) {
        console.log('Socket is not connected. Attempting to reconnect...');
        socket.connect();
      }
    }, 5000);

    return () => {
      clearInterval(checkConnection);
    };
  }, [socket]);

  const fetchUserCommunities = async (userId: string | null) => {
    if (!userId) return;
    try {
      const response = await communityApi.findMy();
      console.log("User communities response:", response.data);
      setCommunities(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user communities:", error);
      setError('커뮤니티 정보를 가져오는데 실패했습니다.');
    }
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && !file) || !socket || !roomId || !userId) return;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      formData.append('author', userId);

      fetch(`${REACT_APP_BACKEND_API_URL}/api/chatrooms/${roomId}/image`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { fileUrl } = data;
          socket.emit('chatImage', { roomId, author: userId, fileUrl });
        })
        .catch((error) => console.error('Error:', error));

      setFile(null);
      setImagePreview(null);
    }

    if (inputMessage.trim()) {
      const payload: ChatMessage = {
        roomId,
        userId,
        message: inputMessage,
        timestamp: new Date(),
      };
      socket.emit('msgToServer', payload, (error: any) => {
        if (error) {
          console.error('Failed to send message:', error);
          setError('메시지 전송에 실패했습니다.');
        } else {
          setInputMessage('');
        }
      });
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
            <button onClick={toggleChat}><X /></button>
          </div>
          <div className="community-selector">
            {communities.map((community) => (
              <button
                key={community.communityId}
                onClick={() => joinRoom(community.communityId)}
                className={selectedCommunity === community.communityId ? 'selected' : ''}
              >
                {community.communityName}
              </button>
            ))}
          </div>
          <ScrollArea className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.userId === userId ? 'outgoing' : 'incoming'}`}>
                {msg.type === 'notification' ? (
                  <div className="notification">{msg.message}</div>
                ) : (
                  <>
                    <strong>{msg.userId}: </strong>
                    {msg.fileUrl ? (
                      <img src={msg.fileUrl} alt="Shared image" style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: msg.message.replace(/#(\S+)/g, '<strong style="color: red;">$1</strong>') }} />
                    )}
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
          {fixedImage && (
            <div className="fixed-image">
              <img src={fixedImage} alt="Fixed image" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
          <div className="chat-input">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <button onClick={() => fileInputRef.current?.click()}>
              <PaperclipIcon />
            </button>
            <button onClick={handleSendMessage}>
              <SendIcon />
            </button>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              <button onClick={() => { setFile(null); setImagePreview(null); }}>
                <X />
              </button>
            </div>
          )}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ChatComponent;
