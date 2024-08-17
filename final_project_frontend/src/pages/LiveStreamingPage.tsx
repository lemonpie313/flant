import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { liveApi } from '../services/api';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './LiveStreamingPage'; // 새로운 CSS 파일을 만들어 스타일을 추가합니다.

interface LiveData {
  liveId: number;
  title: string;
  artistId: number;
  liveHls: string;
  communityId: number;
}

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { liveId } = useParams<{ liveId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

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
    if (liveData?.liveHls) {
      const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: liveData.liveHls,
          type: 'application/x-mpegURL'
        }]
      };

      if (!playerRef.current) {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        playerRef.current = videojs(videoElement, videoJsOptions);

        playerRef.current.on('fullscreenchange', () => {
          setIsFullscreen(playerRef.current.isFullscreen());
        });
      } else {
        const player = playerRef.current;
        player.src({ type: 'application/x-mpegURL', src: liveData.liveHls });
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [liveData]);

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        playerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="live-streaming-container">
      <h1>{liveData?.title}</h1>
      {liveData?.liveHls && (
        <div className="video-container">
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin vjs-big-play-centered"
            ></video>
          </div>
          <button onClick={toggleFullscreen} className="fullscreen-button">
            {isFullscreen ? '전체화면 종료' : '전체화면'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveStreamingPage;
