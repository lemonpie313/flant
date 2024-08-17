import React, { useState } from 'react';
import { Comment } from './types';

interface CommentItemProps extends Comment {
  onReply: (commentId: number, content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ id, author, content, createdAt, onReply }) => {
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

export default CommentItem;
