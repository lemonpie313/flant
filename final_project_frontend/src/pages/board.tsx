import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postApi, authApi, communityApi, commentApi } from '../services/api';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './board.scss';

// 인터페이스 정의
interface Community {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  logoUrl: string;
  coverUrl: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  imageUrl?: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

// 헤더 컴포넌트 (변경 없음)
const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>
    </header>
  );
};

// 토큰 관련 유틸리티 함수들 (변경 없음)
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  // 여기에 토큰 유효성 검사 로직 추가
  return true; // 임시로 true 반환
};

const getUserIdFromToken = (token: string): string | null => {
  // 여기에 토큰에서 사용자 ID 추출 로직 추가
  return "user123"; // 임시로 고정된 사용자 ID 반환
};

// 댓글 컴포넌트
const CommentItem: React.FC<Comment & { onReply: (commentId: number, content: string) => void }> = 
  ({ id, author, content, createdAt, onReply }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(id, replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="comment-item">
      <strong>{author}</strong>
      <p>{content}</p>
      <small>{new Date(createdAt).toLocaleString()}</small>
      <form onSubmit={handleReply}>
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="답글 작성..."
        />
        <button type="submit">답글</button>
      </form>
    </div>
  );
};

// 게시물 카드 컴포넌트
const PostCard: React.FC<Post & { 
  onLike: (postId: number) => void; 
  onComment: (postId: number, content: string) => void;
  onReply: (commentId: number, content: string) => void;
}> = 
  ({ id, author, content, imageUrl, likes, comments, createdAt, isLiked, onLike, onComment, onReply }) => {
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
      {imageUrl && imageUrl.map((url, index) => (
        <img key={index} src={url} alt={`Post content ${index + 1}`} className="post-image" />
      ))}
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
            <CommentItem key={comment.id} {...comment} onReply={onReply} />
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
const PostForm: React.FC<{ onPostCreated: () => void; communityId: number }> = ({ onPostCreated, communityId }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) throw new Error('로그인이 필요합니다.');

      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('유효하지 않은 토큰입니다.');

      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image, index) => {
        formData.append(`postImage`, image);
      });

      await postApi.create(formData, communityId);
      setContent('');
      setImages([]);
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

// 메인 CommunityBoard 컴포넌트
const CommunityBoard: React.FC = () => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = getToken();
      if (isTokenValid(token)) {
        setIsLoggedIn(true);
        await fetchCommunityData();
        await fetchPosts();
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    
    checkAuthAndFetchData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      const response = await communityApi.findOne(Number(communityId));
      setCommunity(response.data);
    } catch (error) {
      console.error('커뮤니티 데이터 가져오기 오류:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await postApi.getPosts(Number(communityId));
      setPosts(response.data);
    } catch (error) {
      console.error('게시물 가져오기 오류:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
        navigate('/login');
      }
    }
  };

  const handleLike = async (postId: number) => {
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

  const handleComment = async (postId: number, content: string) => {
    try {
      await commentApi.create({ postId, content });
      await fetchPosts();
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    try {
      await commentApi.createReply(commentId, { content });
      await fetchPosts();
    } catch (error) {
      console.error('답글 작성 오류:', error);
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
          {community && (
            <div className="community-header">
              <img src={community.coverUrl} alt={community.name} className="community-cover" />
              <h1>{community.name}</h1>
              <p>{community.description}</p>
            </div>
          )}
          {isLoggedIn ? (
            <>
              <PostForm onPostCreated={fetchPosts} communityId={Number(communityId)} />
              <div className="posts-container">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    {...post} 
                    onLike={handleLike}
                    onComment={handleComment}
                    onReply={handleReply}
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
          {community && (
            <div className="community-info">
              <img src={community.logoUrl} alt={community.name} className="community-logo" />
              <h2>{community.name}</h2>
              <p>{community.memberCount} members</p>
              <button className="membership-btn">Membership</button>
              <p>지금 멤버십에 가입하고 특별한 혜택을 누려보세요.</p>
              <button className="join-membership-btn">멤버십 가입하기</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityBoard;
