import React, { useState } from 'react';
import { postApi } from '../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PostFormProps {
  onPostCreated: () => void;
  communityId: number;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated, communityId }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error('로그인이 필요합니다.');

      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image) => formData.append('postImage', image));

      await postApi.create(formData, communityId);
      setContent('');
      setImages([]);
      onPostCreated();
    } catch (error) {
      console.error('게시물 생성 오류:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input 
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="플랜트에 포스트를 남겨보세요."
      />
      <div className="form-actions">
        <input type="file" onChange={handleImageChange} multiple accept="image/*" />
        <button type="submit">게시</button>
      </div>
    </form>
  );
};

export default PostForm;
