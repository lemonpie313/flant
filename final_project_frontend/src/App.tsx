import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import UserInfoPage from "./pages/UserInfo";
import ChatComponent from "./components/ChatComponent";
import { ChatProvider } from './context/ChatContext';
import CommunityBoard from './pages/board';
import LiveStreamingPage from './pages/LiveStreamingPage';
import LiveListPage from './pages/LiveListPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ChatProvider>
      <Router>
        <div>
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/main" replace /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/main" element={<ProtectedRoute element={<MainPage isLoggedIn={isLoggedIn} />} />} />
            <Route path="/userinfo" element={<ProtectedRoute element={<UserInfoPage />} />} />
            <Route path="/communities" element={<CommunityBoard  />} />
            <Route path="/live" element={<LiveListPage  />} />
            <Route path="/live/:liveId" element={<LiveStreamingPage />} />
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>

          {isLoggedIn && (
            <>
              <button onClick={toggleChat} className="fixed bottom-5 right-5 z-50 p-2 bg-blue-500 text-white rounded-full">
                {isChatOpen ? '채팅 닫기' : '채팅 열기'}
              </button>
              {isChatOpen && (
                <div className="fixed bottom-20 right-5 w-80 h-96 z-50 bg-white shadow-lg rounded-lg overflow-hidden">
                  <ChatComponent />
                </div>
              )}
            </>
          )}
        </div>
      </Router>
    </ChatProvider>
  );
};

export default App;