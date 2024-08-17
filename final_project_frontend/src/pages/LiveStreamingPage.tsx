import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { liveApi } from '../services/api';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

interface LiveData {
  liveId: number;
  title: string;
  artistId: number;
  liveHls: string;
  communityId: number;
  // 기타 필요한 필드들...
}

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { liveId } = useParams<{ liveId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await liveApi.watchLive(Number(liveId));
        console.log(response.data);
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
    if (liveData?.liveHls && videoRef.current) {
      const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: liveData.liveHls,
          type: 'application/x-mpegURL'
        }]
      };

      playerRef.current = videojs(videoRef.current, videoJsOptions, function onPlayerReady() {
        console.log('Player is ready');
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [liveData]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">
          라이브 스트리밍 {liveData?.title ? `- ${liveData.title}` : `#${liveId}`}
        </h1>
        <button 
          onClick={toggleFullScreen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {isFullScreen ? '작게 보기' : '크게 보기'}
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center bg-black relative">
        {liveData?.liveHls ? (
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin vjs-big-play-centered"
            />
          </div>
        ) : (
          <p className="text-white text-xl">라이브 스트리밍 데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default LiveStreamingPage;