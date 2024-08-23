import React, { useState } from "react";
import { Comment } from "./types";

interface CommentItemProps extends Comment {
  onReply: (commentId: number, comment: string) => void;
  onEdit: (commentId: number, updatedComment: string, communityId: number, artistId?: number) => void; // artistId를 선택적으로 받음
  onDelete: (commentId: number) => void; // 댓글 삭제 핸들러
}

const CommentItem: React.FC<CommentItemProps> = ({
  commentId,
  author,
  communityId,
  isArtist,
  profileImage,
  comment,
  createdAt,
  onEdit,
  onDelete,
  onReply,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment);
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태 추가

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // 수정 모드로 전환
  };

  const handleSaveEdit = async () => {
    if (newComment.trim()) {
      try {
        await onEdit(commentId, newComment, communityId);
        setIsEditing(false); // Exit editing mode
        setError(null); // Clear error message
      } catch (error) {
        console.error("Failed to edit comment:", error);
        setError("댓글 수정 중 오류가 발생했습니다.");
      }
    } else {
      setError("입력된 내용이 없습니다."); // Set error message
    }
  };

  const handleCancelEdit = () => {
    setNewComment(comment); // 원래 댓글로 되돌리기
    setIsEditing(false); // 수정 모드 종료
  };

  const handleDelete = () => {
    // 확인 다이얼로그 표시
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      console.log("Deleting comment with ID:", commentId); // 댓글 ID가 제대로 출력되는지 확인
      onDelete(commentId); // 댓글 ID를 인자로 전달하여 삭제 핸들러 호출
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img
          src={profileImage || "/default-profile.png"}
          alt={author}
          className="author-image"
          onError={(e) => {
            e.currentTarget.src = "/default-profile.png";
          }}
        />
        <strong>{author}</strong>
        <span>{new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="comment-content">
        {isEditing ? (
          <>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="수정 내용을 입력해주세요"
              className="edit-textarea"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="edit-actions">
              <button onClick={handleSaveEdit} className="save-button">
                저장
              </button>
              <button onClick={handleCancelEdit} className="cancel-button">
                취소
              </button>
            </div>
          </>
        ) : (
          <div className="comment-container">
            <div className="comment-text">{comment}</div>
            <div className="comment-actions">
              <button onClick={handleEdit} className="edit-button">
                수정
              </button>
              <button onClick={handleDelete} className="delete-button">
                삭제
              </button>
            </div>
          </div>
        )}
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
