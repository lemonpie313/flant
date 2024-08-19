import React, { useState } from "react";
import { Comment, Post } from "./types";
import CommentItem from "./CommentItem";
import "../../styles/PostCard.scss";

interface PostCardProps extends Post {
  onLike: (postId: number, likeStatus: boolean) => void;
  onComment: (postId: number, content: string) => void;
  onReply: (commentId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  nickname,
  content,
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
  const [posts, setPosts] = useState<Post[]>([]);
  const handleLike = () => {
    onLike(postId, !isLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(postId, newComment);
      setNewComment("");
    }
  };

  // 게시글 날짜 형식 지정 (MM. DD. HH:MM)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}. ${date
      .getDate()
      .toString()
      .padStart(2, "0")}. ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
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
              <img
                key={image.postImageId}
                src={image.postImageUrl}
                alt="Post"
              />
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

export default PostCard;
