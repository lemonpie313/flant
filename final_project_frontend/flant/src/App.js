import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PostList from './PostList';
import CreatePost from './CreatePost';
import CommentList from './CommentList';
import CreateComment from './CreateComment';

// 메인 애플리케이션 컴포넌트
function App() {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const addPost = (newPost) => {
        setPosts([...posts, newPost]);
    };

    const addComment = (newComment) => {
        setComments([...comments, newComment]);
    };

    return (
        <div>
            {/* 헤더 섹션 */}
            <header>
                <h1>Weverse Page</h1>
            </header>
            {/* 게시물 목록 컴포넌트 */}
            <PostList />
            {/* 게시물 작성 컴포넌트 */}
            <CreatePost onAddPost={addPost} />
            {/* 댓글 목록 컴포넌트 */}
            <CommentList postId={1} />
            {/* 댓글 작성 컴포넌트 */}
            <CreateComment postId={1} onAddComment={addComment} />
        </div>
    );
}

// App 컴포넌트를 루트 요소에 렌더링
ReactDOM.render(<App />, document.getElementById('root'));
