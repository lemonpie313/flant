import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { liveApi } from '../services/api';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Video.js CSS

interface LiveData {
  liveId: number;
  liveId: number;
  title: string;
  artistId: number;
  liveHls: string;
  communityId: number;
}

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
      const interval = setInterval(() => {
        if (videoRef.current) {
          clearInterval(interval);
          const videoJsOptions = {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
              src: liveData.liveHls,
              type: 'application/x-mpegURL'
            }],
            width: 640,
            height: 264
          };
  
          playerRef.current = videojs(videoRef.current, videoJsOptions, function onPlayerReady() {
            console.log('Player is ready');
          });
        }
      }, 100);
    }
  }, [liveData]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <h1>{liveData?.title}</h1>
      {liveData?.liveHls && (
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            width="640"
            height="264"
          ></video>
        </div>
      )}
    </div>
  );
};

export default LiveStreamingPage;