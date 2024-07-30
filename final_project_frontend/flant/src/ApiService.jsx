import axios from 'axios';

// 기본 URL 설정 (여기에 백엔드 서버의 URL을 입력하세요)
const API_URL = 'http://your-backend-server-url/api';

// 게시물 목록 가져오기
export const getPosts = async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
};

// 게시물 작성
export const createPost = async (content) => {
    const response = await axios.post(`${API_URL}/posts`, { content });
    return response.data;
};

// 댓글 목록 가져오기
export const getComments = async (postId) => {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
};

// 댓글 작성
export const createComment = async (postId, content) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
    return response.data;
};
