import React, { useState } from 'react';
import { postApi } from '../../services/api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PostForm.scss'; // SCSS 파일 연결

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const { communityId } = useParams<{ communityId: string }>()
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // 플로팅 폼 열기 상태 관리
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(communityId)
        // communityId가 없는 경우 처리
        if (!communityId) {
          throw new Error('communityId가 제공되지 않았습니다.');
        }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error('로그인이 필요합니다.');
console.log('communityId', communityId)

      const formData = new FormData();
      formData.append('content', content);
      formData.append('communityId', communityId);
      images.forEach((image) => formData.append('postImage', image));
      await postApi.create(formData);
      setContent('');
      setImages([]);
      onPostCreated();
      setIsFormOpen(false);  // 성공 시 폼 닫기
    } catch (error) {
      console.error('게시물 생성 오류:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.querySelector<HTMLInputElement>('.image-upload-input');
    fileInput?.click();
  };

  return (
    <>
      {/* 글쓰기 버튼 */}
      <div 
        className={`floating-btn ${isFormOpen ? 'open' : ''}`}
        onClick={() => setIsFormOpen(true)} // 클릭 시 플로팅 폼 열기
      >
        {/* "게시글을 남겨보세요" 문구 */}
        <span className="post-text">게시글을 남겨보세요</span>

        {/* 이미지 업로드 버튼 */}
        <div className="custom-file-upload">
          <button className="upload-btn" onClick={triggerFileInput}>
            이미지 업로드
          </button>
          <input 
            type="file" 
            onChange={handleImageChange} 
            multiple 
            accept="image/*" 
            className="image-upload-input"
          />
        </div>
      </div>

      {/* 플로팅 윈도우로 나타나는 글쓰기 폼 */}
      {isFormOpen && (
        <div className="overlay">
          <div className="floating-form">
            <form onSubmit={handleSubmit} className="post-form" onClick={(e) => e.stopPropagation()}>
              {/* 텍스트 입력 필드 */}
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="플랜트에 포스트를 남겨보세요."
                className="content-input"
              />

              <div className="form-actions">
                <div className="floating-form-upload">
                  <div className="custom-file-upload">
                    <button className="upload-btn" onClick={triggerFileInput}>
                      이미지 업로드
                    </button>
                    <input 
                      type="file" 
                      onChange={handleImageChange} 
                      multiple 
                      accept="image/*" 
                      className="image-upload-input"
                    />
                  </div>
                </div>
                
                <button type="submit" className="submit-btn">게시</button>
              </div>
            </form>

            <button 
              className="close-btn" 
              onClick={() => setIsFormOpen(false)} // 닫기 버튼으로 폼 닫기
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
