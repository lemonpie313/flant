import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { liveApi, ApiResponse, LiveData } from '../services/api';

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { liveId } = useParams<{ liveId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLiveData = useCallback(async () => {
    if (!liveId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<LiveData> = await liveApi.watchLive(Number(liveId));
      if (response.status === 200) {
        setLiveData(response.data);
      } else {
        setError(response.message || '라이브 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      setError('라이브 데이터를 가져오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
      console.error('라이브 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [liveId]);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  useEffect(() => {
    if (videoRef.current && liveData?.streamUrl) {
      videoRef.current.src = liveData.streamUrl;
      videoRef.current.play().catch(error => {
        console.error('비디오 재생 실패:', error);
        setError('비디오 재생에 실패했습니다. 잠시 후 다시 시도해주세요.');
      });
    }
  }, [liveData]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchLiveData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">
          라이브 스트리밍 {liveData?.title ? `- ${liveData.title}` : `#${liveId}`}
        </h1>
        <button 
          onClick={toggleFullScreen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isFullScreen ? '작게 보기' : '크게 보기'}
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center bg-black">
        {liveData?.streamUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <p className="text-white text-xl">라이브 스트리밍을 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default LiveStreamingPage;