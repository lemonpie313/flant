import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './media.scss';
import { mediaApi } from '@/services/api';

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  name: string;
}

const Media: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isManager, setIsManager] = useState<boolean>(false); // 사용자 권한 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자의 권한을 확인 (이 부분은 사용자 인증 로직에 따라 변경 가능)
    const userRole = localStorage.getItem('userRole'); // 예시로 로컬 스토리지에서 사용자 역할을 가져옴
    setIsManager(userRole === 'manager');

    // 커뮤니티 ID에 따라 미디어 목록 불러오기
    mediaApi.getMediaList(Number(communityId))
      .then(response => {
        setMediaItems(response.data);
      })
      .catch(error => console.error('Error fetching media list:', error));
  }, [communityId]);

  const handleMediaClick = (mediaId: number) => {
    navigate(`/media/${mediaId}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      mediaApi.createMedia(formData)
        .then(() => {
          // 미디어 목록 갱신
          return mediaApi.getMediaList(Number(communityId));
        })
        .then(response => {
          setMediaItems(response.data);
        })
        .catch(error => console.error('Error uploading media:', error));
    }
  };

  return (
    <div className="media-container">
      <h1>Community Media</h1>
      {isManager && (
        <div className="upload-section">
          <label htmlFor="media-upload" className="upload-label">
            Upload Media
          </label>
          <input 
            type="file"
            id="media-upload"
            onChange={handleFileChange}
            className="upload-input"
          />
        </div>
      )}
      <div className="media-grid">
        {mediaItems.map((item) => (
          <div 
            key={item.id} 
            className="media-item" 
            onClick={() => handleMediaClick(item.id)}
          >
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} />
            ) : (
              <video controls>
                <source src={item.url} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;