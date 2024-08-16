import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postApi, authApi } from '../services/api';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './board.scss';

// 헤더 컴포넌트
const Header: React.FC = () => (
  <header className="weverse-header">
    <div className="logo">
      <img src="/weverse-logo.png" alt="Weverse" />
    </div>
    <nav>
      <Link to="/feed" className="active">Feed</Link>
      <Link to="/artist">Artist</Link>
      <Link to="/media">Media</Link>
      <Link to="/live">LIVE</Link>
      <Link to="/shop">Shop</Link>
    </nav>
    <div className="user-actions">
      <button className="search-btn">검색</button>
      <button className="notification-btn">알림</button>
      <button className="profile-btn">프로필</button>
      <button className="settings-btn">설정</button>
    </div>
  </header>
);

// 게시물 인터페이스
interface Post {
  id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

// 토큰 관련 유틸리티 함수들
const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// 댓글 컴포넌트
const CommentItem: React.FC<Comment> = ({ author, content, createdAt }) => (
  <div className="comment-item">
    <strong>{author}</strong>
    <p>{content}</p>
    <small>{new Date(createdAt).toLocaleString()}</small>
  </div>
);

// 게시물 카드 컴포넌트
const PostCard: React.FC<Post & { onLike: (postId: string) => void; onComment: (postId: string, content: string) => void }> = 
  ({ id, author, content, image, likes, comments, createdAt, isLiked, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    onLike(id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={`/profile-images/${author}.jpg`} alt={author} className="author-image" />
        <div className="author-info">
          <h3>{author}</h3>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
        <button className="more-options">...</button>
      </div>
      <p className="post-content">{content}</p>
      {image && <img src={image} alt="Post content" className="post-image" />}
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? 'liked' : ''}>
          좋아요 {likes}
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          댓글 {comments.length}
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          {comments.map((comment) => (
            <CommentItem key={comment.id} {...comment} />
          ))}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <button type="submit">댓글 작성</button>
          </form>
        </div>
      )}
    </div>
  );
};

// 게시물 작성 폼 컴포넌트
const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) throw new Error('로그인이 필요합니다.');

      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('유효하지 않은 토큰입니다.');

      await postApi.create(content);
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('게시물 생성 오류:', error);
      if (error instanceof Error) {
        alert(`게시물 생성 실패: ${error.message}`);
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
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
        <button type="button" className="attach-image">이미지</button>
        <button type="button" className="attach-video">동영상</button>
        <button type="submit">게시</button>
      </div>
    </form>
  );
};

// 메인 CommunityBoard 컴포넌트
const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      const token = getToken();
      if (isTokenValid(token)) {
        setIsLoggedIn(true);
        await fetchPosts();
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    
    checkAuthAndFetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postApi.getPosts();
      console.log('Fetched posts:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('게시물 가져오기 오류:', error);
      if (error instanceof Error) {
        alert(`게시물 가져오기 실패: ${error.message}`);
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
        navigate('/login');
      }
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postApi.like(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked } 
          : post
      ));
    } catch (error) {
      console.error('좋아요 오류:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      await postApi.comment(postId, content);
      await fetchPosts();
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      if (error instanceof Error) {
        alert(`로그아웃 실패: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="community-board">
      <Header />
      <main className="main-content">
        <div className="left-sidebar">
          {/* 왼쪽 사이드바 내용 */}
        </div>
        <div className="center-content">
          <div className="stories-section">
            <div className="story-item">
              <img src="/profile-images/user1.jpg" alt="User 1" />
              <span>하영</span>
            </div>
            <div className="story-item">
              <img src="/profile-images/user2.jpg" alt="User 2" />
              <span>지선</span>
            </div>
            {/* 더 많은 스토리 아이템 */}
          </div>
          {isLoggedIn ? (
            <>
              <PostForm onPostCreated={fetchPosts} />
              <div className="posts-container">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    {...post} 
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))}
              </div>
            </>
          ) : (
            <div>
              <p>이 페이지를 보려면 로그인이 필요합니다.</p>
              <button onClick={() => navigate('/login')}>로그인 페이지로 이동</button>
            </div>
          )}
        </div>
        <div className="right-sidebar">
          <div className="community-info">
            <h2>fromis_9</h2>
            <p>55.2만 members</p>
            <button className="membership-btn">Membership</button>
            <p>지금 멤버십에 가입하고 특별한 혜택을 누려보세요.</p>
            <button className="join-membership-btn">멤버십 가입하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityBoard;
