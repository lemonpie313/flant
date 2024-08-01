import NodeMediaServer from 'node-media-server';

const liveConfig = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      mediaroot: '../media',
      allow_origin: '*',
    },
    trans: {
      ffmpeg:
        '/Users/82104/Downloads/ffmpeg-7.0.1-essentials_build/ffmpeg-7.0.1-essentials_build/bin/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          hlsKeep: true, // to prevent hls file delete after end the stream
        },
      ],
    },
  };

  export const nodeMediaServer = new NodeMediaServer(liveConfig);