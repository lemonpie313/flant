import React, { useEffect, useState } from "react";
import { Comment, CommunityUser, Post, User } from "./types";
import CommentItem from "./CommentItem";
import "../../styles/PostCard.scss";
import { commentApi, communityUserApi, userApi } from "../../services/api";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

interface PostCardProps extends Post {
  onLike: (postId: number, likeStatus: boolean) => void;
  onComment: (
    postId: number,
    comment: string,
    communityId: number,
    artistId?: number,
    imageUrl?: string
  ) => void;
  onReply: (commentId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  nickname,
  content,
  profileImage,
  postImages = [],
  likes,
  comments = [],
  createdAt,
  isLiked,
  onLike,
  onComment,
  onReply,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAllCommentsPopup, setShowAllCommentsPopup] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [artistComments, setArtistComments] = useState<Comment[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);
  const [popupUserId, setPopupUserId] = useState<number | null>(null);
  const { communityId } = useParams<{ communityId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleLike = () => {
    onLike(postId, !isLiked);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.findMy(); // 유저 조회 API 호출
        console.log(response, communityId);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [communityId]);

  const openAllCommentsPopup = async () => {
    console.log("Post ID:", postId); // postId가 제대로 전달되는지 확인
    setPopupPostId(postId); // postId를 상태에 저장
    setShowAllCommentsPopup(true);

    try {
      // 아티스트 댓글 먼저 불러오기
      const artistResponse = await commentApi.getComments(postId!, true);
      console.log(artistResponse.data);
      setArtistComments(artistResponse.data);

      // 일반 댓글 불러오기
      const generalResponse = await commentApi.getComments(postId!, false);
      setCommentsList(generalResponse.data);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  const closeAllCommentsPopup = () => {
    setShowAllCommentsPopup(false);
    setPopupPostId(null); // 팝업을 닫을 때 postId 초기화
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        console.log(newComment);
        await commentApi.create({
          postId: popupPostId!, // 팝업에서 사용될 postId로 댓글 생성
          comment: newComment,
          communityId: Number(communityId),
          // artistId,
          // imageUrl,
        });
        setNewComment("");
        const updatedComments = await commentApi.getComments(popupPostId!, false);
        setCommentsList(updatedComments.data);
      } catch (error) {
        console.error("댓글 작성 실패:", error);
      }
    }
  };

  const loadMoreComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const response = await commentApi.getComments(popupPostId!, false);
      const newComments = response.data;

      if (newComments.length > 0) {
        setCommentsList((prevComments) => [...prevComments, ...newComments]);
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error("Failed to load more comments", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}. ${date
      .getDate()
      .toString()
      .padStart(2, "0")}. ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const getImageLayout = () => {
    if (postImages.length === 1) {
      return "single";
    } else if (postImages.length === 2) {
      return "two";
    } else if (postImages.length === 3) {
      return "three";
    } else {
      return "none";
    }
  };

  const imageLayout = getImageLayout();

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="author-info">
          <img
            src={profileImage || "/default-profile.png"}
            alt={nickname}
            className="author-image"
            onError={(e) => {
              e.currentTarget.src = "/default-profile.png";
            }}
          />
          <div className="author-details">
            <h3>{nickname}</h3>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
      <p className="post-content">{content}</p>
      {imageLayout === "single" && postImages.length > 0 && (
        <div className="post-images single">
          <img src={postImages[0].postImageUrl} alt="Post" />
        </div>
      )}
      {imageLayout === "two" && postImages.length > 0 && (
        <div className="post-images two">
          {postImages.map((image) => (
            <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
          ))}
        </div>
      )}
      {imageLayout === "three" && postImages.length > 0 && (
        <div className="post-images three">
          <div className="left-image">
            <img src={postImages[0].postImageUrl} alt="Post" />
          </div>
          <div className="right-images">
            {postImages.slice(1).map((image) => (
              <img
                key={image.postImageId}
                src={image.postImageUrl}
                alt="Post"
              />
            ))}
          </div>
        </div>
      )}
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? "liked" : ""}>
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <span>{likes}</span> {/* 좋아요 수 표시 */}
        <button onClick={openAllCommentsPopup}>
          <span className="material-symbols-outlined">comment</span>
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          {comments.length > 0
            ? comments.map((comment) => (
                <CommentItem key={comment.id} {...comment} onReply={onReply} />
              ))
            : !loadingComments && <p>No comments yet.</p>}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              id="commentInput"
            />
            <button type="submit">댓글 작성</button>
          </form>
        </div>
      )}
      {showAllCommentsPopup && (
        <div className="comments-popup-overlay">
          <div className="comments-popup">
            <div className="popup-header">
              <button onClick={closeAllCommentsPopup}>X</button>
            </div>
            <div className="popup-content">
              <div className="post-content-left">
                <h3>게시글 내용</h3>
                <p>{content}</p>
                {postImages.length > 0 &&
                  postImages.map((image) => (
                    <img
                      key={image.postImageId}
                      src={image.postImageUrl}
                      alt="Post"
                    />
                  ))}
              </div>
              <div className="post-content-right">
                <h3>댓글</h3>
                <InfiniteScroll
                  dataLength={commentsList.length}
                  next={loadMoreComments}
                  hasMore={hasMoreComments}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                  {artistComments.length > 0 && (
                    <>
                      <h4>아티스트 댓글</h4>
                      {artistComments.map((comment) => (
                        <CommentItem
                          key={comment.id}
                          {...comment}
                          onReply={onReply}
                        />
                      ))}
                    </>
                  )}
                  {commentsList.length > 0 ? (
                    commentsList.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        {...comment}
                        onReply={onReply}
                      />
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </InfiniteScroll>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                  />
                  <button type="submit">댓글 작성</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
