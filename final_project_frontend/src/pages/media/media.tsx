import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './media.scss';
import { mediaApi } from '../../services/api';
import CommunityNavigationHeader from '../../components/communityBoard/CommunityNavigationHeader';

interface MediaItem {
  mediaId: number;
  title: string;
  content: string;
  thumbnailImage: string | undefined;
  mediaFiles: string[]; // mediaFiles 배열로 설정
}

const Media: React.FC = () => {
  const { communityId, mediaId } = useParams<{ communityId: string; mediaId?: string }>();
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isManager, setIsManager] = useState<boolean>(false);
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsManager(userRole === 'manager');

    mediaApi.getMediaList(Number(communityId))
      .then(response => {
        setMediaItems(response.data.data);
      })
      .catch(error => console.error('Error fetching media list:', error));
  }, [communityId]);

  useEffect(() => {
    if (mediaId) {
      mediaApi.getMediaOne(Number(mediaId))
        .then(response => {
          setSelectedMedia(response.data.data);
          console.log(selectedMedia)
        })
        .catch(error => console.error('Error fetching media detail:', error));
    } else {
      setSelectedMedia(null); // mediaId가 없으면 리스트만 표시
    }
  }, [mediaId]);

  const handleMediaClick = (mediaId: number) => {
    navigate(`/communities/${communityId}/media/${mediaId}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      mediaApi.createMedia(formData)
        .then(() => mediaApi.getMediaList(Number(communityId)))
        .then(response => {
          setMediaItems(response.data.data);
        })
        .catch(error => console.error('Error uploading media:', error));
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>, mediaId: number) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      mediaApi.patchThumbnail(formData, mediaId)
        .then(() => mediaApi.getMediaList(Number(communityId)))
        .then(response => {
          setMediaItems(response.data.data);
        })
        .catch(error => console.error('Error updating thumbnail:', error));
    }
  };

  return (
    <div className="media-container">
      <CommunityNavigationHeader /> {/* 네비게이션 바 추가 */}

      {selectedMedia ? (
  <div className="media-detail-container">
    <h1 className="media-title">{selectedMedia.title}</h1>
    <div className="media-files">
      {selectedMedia.mediaFiles && selectedMedia.mediaFiles.length > 0 ? (
        selectedMedia.mediaFiles.map((file, index) => (
          file.endsWith('.mp4') ? (
            <video key={index} controls className="media-file">
              <source src={file} type="video/mp4" />
            </video>
          ) : (
            <img key={index} src={file} alt={`Media file ${index}`} className="media-file" />
          )
        ))
      ) : (
        <img src={selectedMedia.thumbnailImage} alt="Thumbnail" className="media-file" />
      )}
    </div>
    <div className="media-content">
      <p>{selectedMedia.content}</p>
    </div>
    <button onClick={() => navigate(`/communities/${communityId}/media`)}>Back to list</button>
  </div>
) : (
        <>
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
                key={item.mediaId} 
                className="media-item" 
                onClick={() => handleMediaClick(item.mediaId)}
              >
                {item.thumbnailImage ? (
                  <img src={item.thumbnailImage} alt={item.title} />
                ) : (
                  <div className="no-thumbnail">No Thumbnail</div>
                )}
                <p>{item.title}</p>

                {isManager && (
                  <label className="thumbnail-edit-label">
                    <input 
                      type="file"
                      onChange={(event) => handleThumbnailChange(event, item.mediaId)}
                      className="thumbnail-edit-input"
                    />
                    Edit Thumbnail
                  </label>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {isManager && !selectedMedia && (
        <button className="floating-button" onClick={() => document.getElementById('media-upload')?.click()}>
          +
        </button>
      )}
    </div>
  );
};

export default Media;
