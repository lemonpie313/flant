import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import UserInfoPage from "./pages/UserInfo";
import ChatComponent from "./components/ChatComponent";
import { ChatProvider } from './context/ChatContext';
import CommunityBoard from './pages/board';
import LiveStreamingPage from './pages/LiveStreamingPage';
import LiveListPage from './pages/LiveListPage';
import { userApi } from './services/api';
import CommunityBoardTest from "./pages/CommunityBoardTest";
import MerchandiseList from "./pages/merchandiseList";
import MerchandiseDetail from "./pages/merchandiseDetail";



// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   const AuthChecker: React.FC = () => {
//     const location = useLocation();

//     useEffect(() => {
//       const fetchData = async () => {
//         const currentPath = window.location.pathname;
//         if (currentPath !== "/login" && currentPath !== "/signup") {
//           try {
//             await userApi.findMy();
//             setIsLoggedIn(true);
//           } catch (error) {
//             console.log("error", error);
//             localStorage.removeItem("accessToken");
//             setIsLoggedIn(false);
//           }
//         }
//         setLoading(false);
//       };
//       fetchData();
//     }, []);
    
//     if (loading) {
//       return <div>Loading...</div>;
//     }
//     return null;
//   };

//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
//     console.log("ProtectedRoute" ,isLoggedIn)
//     if (!isLoggedIn) {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <ChatProvider>
//       <Router>
//         <AuthChecker />
//         <div>
//           <Routes>
//             <Route path="/login" element={isLoggedIn ? <Navigate to="/main" replace /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
//             <Route path="/signup" element={<SignUpPage />} />
//             <Route path="/main" element={<ProtectedRoute><MainPage isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
//             <Route path="/userinfo" element={<ProtectedRoute><UserInfoPage /></ProtectedRoute>} />
//             <Route path="/communities" element={<ProtectedRoute><CommunityBoard /></ProtectedRoute>} />
//             <Route path="/communitiess" element={<CommunityBoardTest />} />
//             <Route path="/live" element={<ProtectedRoute><LiveListPage /></ProtectedRoute>} />
//             <Route path="/live/:liveId" element={<ProtectedRoute><LiveStreamingPage /></ProtectedRoute>} />
//             <Route path="/" element={<Navigate to="/main" replace />} />
//             <Route path="*" element={<Navigate to="/main" replace />} />
//           </Routes>

//           {isLoggedIn && (
//             <>
//               <button 
//                 onClick={toggleChat} 
//                 className="fixed bottom-5 right-5 z-50 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//               >
//                 {isChatOpen ? '채팅 닫기' : '채팅 열기'}
//               </button>
//               {isChatOpen && (
//                 <div className="fixed bottom-20 right-5 w-80 h-96 z-50 bg-white shadow-lg rounded-lg overflow-hidden">
//                   <ChatComponent />
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </Router>
//     </ChatProvider>
//   );
// };

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        try {
          await userApi.findMy();
          setIsLoggedIn(true);
        } catch (error) {
          console.log("error", error);
          localStorage.removeItem("accessToken");
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (isLoggedIn === false) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  return (
    <ChatProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/main" replace /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/main" element={<ProtectedRoute><MainPage isLoggedIn={isLoggedIn!} /></ProtectedRoute>} />
            <Route path="/userinfo" element={<ProtectedRoute><UserInfoPage /></ProtectedRoute>} />
            <Route path="/communities" element={<ProtectedRoute><CommunityBoard /></ProtectedRoute>} />
            <Route path="/communities/:communityId" element={<ProtectedRoute><CommunityBoard /></ProtectedRoute>} />
            <Route path="/communitiess" element={<CommunityBoardTest />} />
            <Route path="/live" element={<ProtectedRoute><LiveListPage /></ProtectedRoute>} />
            <Route path="/live/:liveId" element={<ProtectedRoute><LiveStreamingPage /></ProtectedRoute>} />
            <Route path="/merchandise" element={<ProtectedRoute><MerchandiseList communityId={1} /></ProtectedRoute>} />
            <Route path="/merchandise/:merchandiseId" element={<ProtectedRoute><MerchandiseDetail /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
          {isLoggedIn && (
            <>
              <button
                onClick={toggleChat}
                className="fixed bottom-5 right-5 z-50 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
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
