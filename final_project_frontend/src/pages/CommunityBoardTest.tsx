import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  communityApi,
  postApi,
  commentApi,
  userApi,
  communityUserApi,
} from "../services/api";
import axios from "axios";
import Header from "../components/communityBoard/Header";
import PostForm from "../components/communityBoard/PostForm";
import PostCard from "../components/communityBoard/PostCard";
import { Community, Post, User } from "../components/communityBoard/types";
import "./board.scss";

const CommunityBoardTest: React.FC = () => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const communityId = 1;
  const userId = 3;
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        await fetchCommunityData();
        await fetchPosts();
        await fetchUsers();
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkAuthAndFetchData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      const response = await communityApi.findOne(1);
      console.log(response.data.data);
      setCommunity(response.data.data);
      console.log(community?.communityLogoImage);
    } catch (error) {
      console.error("커뮤니티 데이터 가져오기 오류:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await communityUserApi.findCommunityUser(
        communityId,
        userId
      );
      console.log("zdfdz");
      console.log(response.data.data);
      //setCommunity(response.data.data);
    } catch (error) {
      console.error("커뮤니티유저 데이터 가져오기 오류:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await postApi.getPosts(3);
      setPosts(response.data);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await postApi.like(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              }
            : post
        )
      );
    } catch (error) {
      console.error("좋아요 오류:", error);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      await commentApi.create({ postId, content });
      await fetchPosts();
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    try {
      await commentApi.createReply(commentId, { content });
      await fetchPosts();
    } catch (error) {
      console.error("답글 작성 오류:", error);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="community-board">
      <Header />
      <main className="main-content">
        <div className="left-sidebar">{/* 왼쪽 사이드바 내용 */}</div>
        <div className="center-content">
          {/* {community && (
            <div className="community-header">
              <img
                src={community.communityCoverImage}
                alt={community.communityName}
                className="community-cover"
              />
              <h1>{community.communityName}</h1>
            </div>
          )} */}
          {isLoggedIn ? (
            <>
              <PostForm
                onPostCreated={fetchPosts}
                communityId={Number(communityId)}
              />
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
              <button onClick={() => navigate("/login")}>
                로그인 페이지로 이동
              </button>
            </div>
          )}
        </div>
        <div className="right-sidebar">
          <div className="right-sidebar-profile-card">
            <img
              src={community?.communityCoverImage}
              alt={community?.communityName}
              className="right-sidebar-profile-image"
            />
            <div className="right-sidebar-profile-info">
              <h2>{community?.communityName}</h2>
              <p>16,692 members</p>
            </div>
          </div>
          <div className="right-sidebar-membership">
            <button className="right-sidebar-membership-button">
              Membership
            </button>
            <p>자유 멤버십에 가입해서 새로운 스케줄 소식을 받아보세요.</p>
            <button className="right-sidebar-join-button">
              멤버십 가입하기
            </button>
          </div>
          <div className="right-sidebar-dm-section">
            <button className="right-sidebar-dm-button">Weverse DM</button>
            <p>지금 DM하세요!</p>
          </div>
          <div className="right-sidebar-user-info">
            <img
              src="https://example.com/user-placeholder.jpg" // 실제 이미지 URL로 변경 필요
              alt="User"
              className="right-sidebar-user-image"
            />
            <p>lutaseo</p>
            <p>0 posts</p>
          </div>
          <div className="right-sidebar-community-notice">
            <h3>커뮤니티 공지사항</h3>
            <p>[NOTICE] CHUU 2ND MINI ALBUM...</p>
          </div>
          {/* {community && (
            <div className="community-info">
              <img
                src={community.communityLogoImage}
                alt={community.communityName}
                className="community-logo"
              />
              <h2>{community.communityName}</h2>
              <p>{community.memberCount} members</p>
              <button className="membership-btn">Membership</button>
              <p>지금 멤버십에 가입하고 특별한 혜택을 누려보세요.</p>
              <button className="join-membership-btn">멤버십 가입하기</button>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default CommunityBoardTest;
