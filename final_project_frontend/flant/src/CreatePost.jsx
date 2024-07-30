import React, { useState } from 'react';
import { createPost } from './apiService';

// 게시물 작성 버튼을 표시하는 컴포넌트
function CreatePost({ onAddPost }) {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content) {
            const newPost = await createPost(content);
            onAddPost(newPost);
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="게시물을 작성하세요"
            ></textarea>
            <button type="submit">게시물 작성</button>
        </form>
    );
}

export default CreatePost;
