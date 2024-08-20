// LiveListPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { liveApi } from '../services/api';

interface Live {
  id: number;
  title: string;
  artistId: string;
  // 기타 필요한 필드들...
}

const LiveListPage: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const response = await liveApi.findAllLives('community-id'); // 실제 커뮤니티 ID로 교체해야 함
        setLives(response.data.data);
      } catch (error) {
        console.error('라이브 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchLives();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">라이브 스트리밍 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lives.map((live) => (
          <Link to={`/live/${live.id}`} key={live.id} className="block p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold">{live.title}</h2>
            <p>아티스트 ID: {live.artistId}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LiveListPage;
