// LiveStreamingPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { liveApi } from '../services/api';

interface LiveData {
  id: number;
  title: string;
  streamUrl: string;
  // 기타 필요한 필드들...
}

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const { liveId } = useParams<{ liveId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await liveApi.watchLive(Number(liveId));
        if (response.data.status === 200) {
          setLiveData(response.data.data);
        } else {
          console.error('라이브 데이터를 가져오는데 실패했습니다:', response.data.message);
        }
      } catch (error) {
        console.error('라이브 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    if (liveId) {
      fetchLiveData();
    }
  }, [liveId]);

  useEffect(() => {
    if (videoRef.current && liveData?.streamUrl) {
      videoRef.current.src = liveData.streamUrl;
      videoRef.current.play().catch(error => console.error('비디오 재생 실패:', error));
    }
  }, [liveData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        라이브 스트리밍 {liveData?.title ? `- ${liveData.title}` : `#${liveId}`}
      </h1>
      <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>
        {liveData?.streamUrl ? (
          <video
            ref={videoRef}
            className="w-full aspect-video"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <p>라이브 스트리밍 데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default LiveStreamingPage;
