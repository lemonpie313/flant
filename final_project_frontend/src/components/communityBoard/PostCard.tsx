import React, { useEffect, useState } from "react";
import { Comment, CommunityUser, Post, User } from "./types";
import CommentItem from "./CommentItem";
import "../../styles/PostCard.scss";
import { commentApi, communityUserApi, userApi } from "../../services/api";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

interface PostCardProps extends Post {
  onLike: (postId: number, likeStatus: boolean) => void;
  onComment: (postId: number, comment: string, communityId: number, artistId?: number, imageUrl?: string) => void;
  onReply: (commentId: number, content: string) => void;
  artistId?: number; // PostCard에 artistId를 선택적으로 전달
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
  artistId, // artistId를 받아옴
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAllCommentsPopup, setShowAllCommentsPopup] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);
  const [popupUserId, setPopupUserId] = useState<number | null>(null);
  const [communityUserId, setCommunityUser] = useState<CommunityUser>();
  const { communityId } = useParams<{ communityId: string }>();
  const [currentCommunityUserId, setCurrentCommunityUserId] = useState<number | null>(null);
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleLike = () => {
    onLike(postId, !isLiked);
  };

  //정보 가져오기
  // const fetchCommunityUsers = async () => {
  //   try {
  //     const response = await communityUserApi.findCommunityUser(Number(communityId));
  //     setCommunityUser(response.data);
  //   } catch (error) {
  //     console.error("커뮤니티유저 데이터 가져오기 오류:", error);
  //   }
  // };
  // // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await userApi.findMy(); // 유저 조회 API 호출
  //       console.log(response, communityId);
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch user:", error);
  //     }
  //   };
  // });

  // 로그인된 사용자의 communityUserId 가져오기
  // useEffect(() => {
  //   const fetchCommunityUsers = async () => {
  //     try {
  //       const response = await communityUserApi.findCommunityUser(Number(communityId));
  //       setCommunityUsers(response.data);

  //       // 현재 로그인 사용자의 communityUserId 찾기
  //       // 여기서는 현재 로그인 사용자 ID를 사용하는 API 호출을 가정
  //       const currentUserResponse = await userApi.findMy();
  //       const currentUserId = currentUserResponse.data.id;

  //       const currentUserCommunityUser = response.data.find((user) => user.userId === currentUserId);
  //       setCurrentCommunityUserId(currentUserCommunityUser?.communityUserId || null);
  //     } catch (error) {
  //       console.error("Failed to fetch community users:", error);
  //     }
  //   };

  //   fetchCommunityUsers();
  // }, [communityId]);
  // // 댓글 작성자와 현재 사용자 비교
  // const isCommentOwner = (comment: Comment) => {
  //   return currentCommunityUserId === comment.authorId;
  // };

  useEffect(() => {
    const fetchComments = async () => {
      if (popupPostId !== null) {
        try {
          const response = await commentApi.getComments(popupPostId);
          setCommentsList(response.data);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      }
    };
    fetchComments();
  }, [popupPostId]);

  const openAllCommentsPopup = () => {
    setPopupPostId(postId); // postId를 상태에 저장
    setShowAllCommentsPopup(true);
  };

  const closeAllCommentsPopup = () => {
    setShowAllCommentsPopup(false);
    setPopupPostId(null); // 팝업을 닫을 때 postId 초기화
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await commentApi.create({
          postId: popupPostId!, // 팝업에서 사용될 postId로 댓글 생성
          comment: newComment,
          communityId: Number(communityId),
          artistId: Number(artistId),
          // imageUrl,
        });
        if (artistId) {
          artistId; // artistId가 있을 경우에만 추가
        }

        setNewComment("");
        const updatedComments = await commentApi.getComments(popupPostId!);
        setCommentsList(updatedComments.data);
      } catch (error) {
        console.error("댓글 작성 실패:", error);
      }
    }
  };

  const handleEditComment = async (commentId: number, updatedComment: string) => {
    const numericArtistId = artistId ? Number(artistId) : undefined;

    try {
      await commentApi.patchComment(commentId, {
        comment: updatedComment,
        artistId: numericArtistId,
      });
      const updatedComments = await commentApi.getComments(popupPostId!);
      setCommentsList(updatedComments.data);
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setCommentsList((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const loadMoreComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const response = await commentApi.getComments(popupPostId!);
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
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}. ${date.getDate().toString().padStart(2, "0")}. ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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
              <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
            ))}
          </div>
        </div>
      )}
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? "liked" : ""}>
          <span className="material-symbols-outlined">favorite</span> {likes}
        </button>
        <button onClick={openAllCommentsPopup}>
          <span className="material-symbols-outlined">comment</span>
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          {commentsList.length > 0
            ? commentsList.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  {...comment}
                  commentId={comment.commentId}
                  onDelete={handleDeleteComment}
                  onEdit={() => {}}
                  onReply={() => {}}
                />
              ))
            : !loadingComments && <p>댓글이 존재하지 않습니다.</p>}
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
                  postImages.map((image) => <img key={image.postImageId} src={image.postImageUrl} alt="Post" />)}
              </div>
              <div className="comments-content-right">
                <h3>전체 댓글</h3>
                <InfiniteScroll
                  dataLength={commentsList.length}
                  next={loadMoreComments}
                  hasMore={hasMoreComments}
                  loader={loadingComments && <p>Loading...</p>}
                  endMessage={!hasMoreComments && <p>No more comments</p>}
                >
                  {commentsList.length > 0
                    ? commentsList.map((comment) => (
                        <CommentItem
                          key={comment.commentId}
                          {...comment}
                          commentId={comment.commentId}
                          onReply={onReply}
                          onEdit={handleEditComment}
                          onDelete={handleDeleteComment}
                        />
                      ))
                    : !loadingComments && <p>댓글이 존재하지 않습니다.</p>}
                </InfiniteScroll>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성하세요..."
                    className="comment-input"
                    id="popupCommentInput"
                  />
                  <button type="submit" className="submit-btn">
                    등록
                  </button>
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
