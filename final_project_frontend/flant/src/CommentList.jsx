import React, { useState, useEffect } from 'react';
import { getComments } from './apiService';

// 댓글 목록을 표시하는 컴포넌트
function CommentList({ postId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // 댓글 목록을 가져오는 함수
        const fetchComments = async () => {
            const data = await getComments(postId);
            setComments(data);
        };

        fetchComments();
    }, [postId]);

    return (
        <div className="container">
            <h3>댓글 목록</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.content}</li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;
