// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import UserInfoPage from "./pages/UserInfo";
import ChatComponent from "./components/ChatComponent"; // ChatComponent로 이름 변경
import { ChatProvider } from './context/ChatContext'; // ChatContext 추가

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* 다른 라우트들도 여기에 추가할 수 있습니다 */}
      </Routes>
    </Router>
  );
};

export default App;
