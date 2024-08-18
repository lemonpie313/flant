import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityApi, postApi, commentApi } from '../services/api';
import axios from 'axios';
import Header from '../components/communityBoard/Header';
import PostForm from '../components/communityBoard/PostForm';
import PostCard from '../components/communityBoard/PostCard';
import { Community,Post } from '../components/communityBoard/types';
import './board.scss';

const CommunityBoardTest: React.FC = () => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        await fetchCommunityData();
        // await fetchPosts();
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
      setCommunity(response.data.data);
      if(response.data.data?.posts) setPosts(response.data.data?.posts)
    } catch (error) {
      console.error('커뮤니티 데이터 가져오기 오류:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await postApi.getPosts(Number(3));
      const postsData = response.data.data as Post[]; // 타입 명시
      setPosts(postsData);
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
        post.postId === postId 
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
              <PostForm onPostCreated={fetchPosts} />
              <div className="posts-container">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.postId} 
                    {...post} 
                    
                    onLike={handleLike}
                    onComment={handleComment}
                    onReply={handleReply}
                  />
                ))
              ) : (
                <p>게시물이 없습니다.</p>
              )}
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

export default CommunityBoardTest;
