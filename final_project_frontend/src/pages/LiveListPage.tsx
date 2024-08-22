import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { liveApi, authApi } from '../services/api';
import Header from "../components/communityBoard/Header";
import CommunityNavigationHeader from "../components/communityBoard/liveHeader";

interface Live {
  id: number;
  title: string;
  artistId: string;
}

const LiveListPage: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        // 여기에 필요한 다른 초기화 작업을 추가하세요.
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      setIsLoggedIn(false);
      navigate("/main");
      window.location.reload();
    } catch (error) {
      alert("로그아웃 실패.");
    }
  };

  const handleLiveClick = (liveId: number) => {
    navigate(`/live/${liveId}`);
  };

  return (
    <div>
      <Header communityName="라이브 스트리밍" isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <CommunityNavigationHeader />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">라이브 스트리밍 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lives.map((live) => (
            <Link
              to={`/live/${live.id}`}
              key={live.id}
              className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold">{live.title}</h3>
              <p>Artist ID: {live.artistId}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveListPage;
