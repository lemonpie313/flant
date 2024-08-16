import React, { useEffect, useRef } from 'react';

// videojs에 대한 타입 선언
declare global {
  interface Window {
    videojs: any;
  }
}

const LiveStreamingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideoJS = async () => {
      if (typeof window.videojs === 'undefined') {
        // Load Video.js script
        const script = document.createElement('script');
        script.src = 'https://vjs.zencdn.net/7.20.3/video.min.js';
        script.async = true;
        document.body.appendChild(script);

        // Load Video.js CSS
        const link = document.createElement('link');
        link.href = 'https://vjs.zencdn.net/7.20.3/video-js.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Wait for Video.js to load
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
        });
      }

      // Initialize player
      if (videoRef.current) {
        const player = window.videojs(videoRef.current, {
          autoplay: true,
          controls: true,
          sources: [{
            src: 'http://localhost:8000/live/9bb00aedae434cd0b81bd336085127745321cf41/index.m3u8',
            type: 'application/x-mpegURL'
          }]
        });

        // Clean up on unmount
        return () => {
          if (player) {
            player.dispose();
          }
        };
      }
    };

    loadVideoJS();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Live Streaming</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            width="100%"
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveStreamingPage;