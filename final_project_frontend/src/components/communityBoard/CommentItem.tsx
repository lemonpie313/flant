import React, { useState } from "react";
import { Comment } from "./types";
import "../../styles/CommentItem.scss";

interface CommentItemProps extends Comment {
  onReply: (commentId: number, comment: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  author,
  comment,
  createdAt,
  onReply,
  profileImage, 
  isArtist,    
}) => {
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(id, replyContent);
      setReplyContent("");
    }
  };

  return (
    <div className={`comment-item ${isArtist ? "artist-comment" : ""}`}>
      <img
        src={profileImage || "/default-profile.png"}
        alt={author}
        className="comment-profile-image"
        onError={(e) => {
          e.currentTarget.src = "/default-profile.png";
        }}
      />
      <div className="comment-content">
        <div className="comment-header">
          <strong>{author}</strong>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
        <p className="comment-content">{comment}</p>
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
    </div>
  );
};

export default CommentItem;
