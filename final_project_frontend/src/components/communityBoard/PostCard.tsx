
import React, { useState } from 'react';
import { Comment } from './types';  // Comment 타입은 별도 types 파일에서 관리
import CommentItem from './CommentItem';

interface PostCardProps {
  id: number;
  author: string;
  content: string;
  imageUrl?: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
  onReply: (commentId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id, author, content, imageUrl, likes, comments, createdAt, isLiked,
  onLike, onComment, onReply
}) => {
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

export default PostCard;
