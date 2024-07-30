import React, { useState } from 'react';
import { createComment } from './apiService';

// 댓글 작성 버튼을 표시하는 컴포넌트
function CreateComment({ postId, onAddComment }) {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content) {
            const newComment = await createComment(postId, content);
            onAddComment(newComment);
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 작성하세요"
            ></textarea>
            <button type="submit">댓글 작성</button>
        </form>
    );
}

export default CreateComment;
