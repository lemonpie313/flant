import React from "react";
import CommentItem from "./CommentItem";
import { Comment } from "./types";
import "../../styles/CommentList.scss";

interface CommentListProps {
  comments: Comment[];
  onReply: (commentId: number, comment: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default CommentList;