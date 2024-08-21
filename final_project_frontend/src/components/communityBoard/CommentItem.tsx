import React, { useState } from "react";
import { Comment } from "./types";

interface CommentItemProps extends Comment {
  onReply: (commentId: number, comment: string) => void;
  onEdit: (commentId: number) => void; // 댓글 수정 핸들러
  onDelete: (commentId: number) => void; // 댓글 삭제 핸들러
}

const CommentItem: React.FC<CommentItemProps> = ({ id, author, comment, createdAt, onEdit, onDelete, onReply }) => {
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(id, replyContent);
      setReplyContent("");
    }
  };

  const handleEdit = () => {
    onEdit(id); // 댓글 ID를 인자로 전달하여 수정 핸들러 호출
  };

  const handleDelete = () => {
    onDelete(id); // 댓글 ID를 인자로 전달하여 삭제 핸들러 호출
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <strong className="comment-author">{author}</strong>
        <span className="comment-time">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="comment-content">
        <p>{comment}</p>
      </div>
      <div className="comment-actions">
        <button onClick={handleEdit} className="edit-button">
          수정
        </button>
        <button onClick={handleDelete} className="delete-button">
          삭제
        </button>
      </div>
      {/* <button onClick={() => setReplyContent("답글")} className="reply-button">
        답글
      </button>
      {replyContent && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
          />
          <button type="submit">답글 작성</button>
        </form>
      )} */}
    </div>
  );
};

export default CommentItem;
