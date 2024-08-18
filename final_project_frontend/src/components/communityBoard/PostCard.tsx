import React, { useState } from 'react';
import { Comment, Post } from './types';
import CommentItem from './CommentItem';
import "../../styles/PostCard.scss"

interface PostCardProps extends Post {
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
  onReply: (commentId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  postId, communityUserId, content, postImages = [], likes, comments, createdAt, isLiked,
  onLike, onComment, onReply
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    onLike(postId);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(postId, newComment);
      setNewComment('');
    }
  };

  // 날짜 형식 지정 (MM. DD. HH:MM)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}. ${date.getDate().toString().padStart(2, '0')}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };


  return (
    <div className="post-card">
      <div className="post-header">
        <div className="author-info">
          <img 
            src={`/profile-images/${communityUserId}`} 
            alt={communityUserId+"임시(이름)"} 
            className="author-image" 
            onError={(e) => { e.currentTarget.src = '/default-profile.png'; }} 
          />
          <div className="author-details">
            <h3>{communityUserId + "이름"}</h3>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        {/* <button className="more-options">...</button> */}
      </div>
      <p className="post-content">{content}</p>
      {postImages.length > 0 && (
        postImages.map((image) => (
          <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
        ))
      )}
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? 'liked' : ''}>
          <span className="material-symbols-outlined">favorite</span> {likes}
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
