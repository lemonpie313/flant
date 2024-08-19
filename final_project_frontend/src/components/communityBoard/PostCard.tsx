import React, { useEffect, useState } from "react";
import { Comment, CommunityUser, Post, User } from "./types";
import CommentItem from "./CommentItem";
import "../../styles/PostCard.scss";
import { commentApi, communityUserApi, userApi } from "@/services/api";
import { useParams } from "react-router-dom";

interface PostCardProps extends Post {
  imageUrl?: string; // 또는 imageUrl?: string[];
  onLike: (postId: number, likeStatus: boolean) => void;
  onComment: (postId: number, content: string) => void;
  onReply: (commentId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  nickname,
  content,
  imageUrl,
  profileImage,
  postImages = [],
  likes,
  comments,
  createdAt,
  isLiked,
  onLike,
  onComment,
  onReply,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAllCommentsPopup, setShowAllCommentsPopup] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);
  const [popupUserId, setPopupUserId] = useState<number | null>(null);
  const [communityUser, setCommunityUser] = useState<CommunityUser>();
  const { communityId } = useParams<{ communityId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleLike = () => {
    onLike(postId, !isLiked);
  };

  //정보 가져오기
  const fetchCommunityUsers = async () => {
    try {
      const response = await communityUserApi.findCommunityUser(Number(communityId));
      setCommunityUser(response.data);
    } catch (error) {
      console.error("커뮤니티유저 데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.findMy(); // 유저 조회 API 호출
        console.log(response, communityId);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  });

  // const handleCommentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     onComment(postId, newComment);
  //     setNewComment("");
  //   }
  // };
  // 게시글 날짜 형식 지정 (MM. DD. HH:MM)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}. ${date.getDate().toString().padStart(2, "0")}. ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // 게시글 이미지 layout 설정
  const getImageLayout = () => {
    if (postImages.length === 1) {
      return "single";
    } else if (postImages.length === 2) {
      return "two";
    } else if (postImages.length === 3) {
      return "three";
    } else {
      return "none";
    }
  };

  const imageLayout = getImageLayout();

  const openAllCommentsPopup = () => {
    setPopupPostId(postId);
    // setPopupUserId(communityUserId);
    setShowAllCommentsPopup(true);
  };

  const closeAllCommentsPopup = () => {
    setShowAllCommentsPopup(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim()) {
      // imageUrl이 undefined일 수 있으므로, 배열인지 먼저 확인
      const imageUrlToUse = Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : "";
      try {
        if (popupPostId && popupUserId) {
          await commentApi.create({
            postId: popupPostId,
            communityUserId: popupUserId,
            content: newComment,
            imageUrl: imageUrlToUse, // imageUrl이 undefined이면 빈 문자열을 사용
          });
          setNewComment("");
        } else {
          console.error("Post ID or User ID is missing");
        }
      } catch (error) {
        console.error("Failed to create comment:", error);
      }
    }

    const loadMoreComments = async () => {
      if (loadingComments) return;
      setLoadingComments(true);
      try {
        const response = await commentApi.getComments(postId, Math.ceil(commentsList.length / 10) + 1, 10);
        const newComments = response.data;

        if (newComments.length > 0) {
          setCommentsList((prevComments) => [...prevComments, ...newComments]);
        } else {
          setHasMoreComments(false);
        }
      } catch (error) {
        console.error("Failed to load more comments", error);
      } finally {
        setLoadingComments(false);
      }
    };

    return (
      <div className="post-card">
        <div className="post-header">
          <div className="author-info">
            <img
              src={profileImage}
              alt={nickname}
              className="author-image"
              onError={(e) => {
                e.currentTarget.src = "/default-profile.png";
              }}
            />
            <div className="author-details">
              <h3>{nickname}</h3>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
          {/* <button className="more-options">...</button> */}
        </div>
        <p className="post-content">{content}</p>
        {imageLayout === "single" && (
          <div className="post-images single">
            <img src={postImages[0].postImageUrl} alt="Post" />
          </div>
        )}
        {imageLayout === "two" && (
          <div className="post-images two">
            {postImages.map((image) => (
              <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
            ))}
          </div>
        )}
        {imageLayout === "three" && (
          <div className="post-images three">
            <div className="left-image">
              <img src={postImages[0].postImageUrl} alt="Post" />
            </div>
            <div className="right-images">
              {postImages.slice(1).map((image) => (
                <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
              ))}
            </div>
          </div>
        )}
        <div className="post-actions">
          <button onClick={handleLike} className={isLiked ? "liked" : ""}>
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button onClick={() => setShowComments(!showComments)}>
            <span className="material-symbols-outlined">comment</span>
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
};

export default PostCard;
