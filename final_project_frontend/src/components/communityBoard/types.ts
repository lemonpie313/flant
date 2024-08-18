export interface Community {
  communityId: number;
  communityName: string;
  memberCount: number;
  communityLogoImage: string;
  communityCoverImage: string;
  membershipPrice: number;
}

interface PostImage {
  postImageId: number;
  postImageUrl: string;
}

export interface Post {
  postId: number;
  // author: string;
  communityUserId: number;
  content: string;
  postImages?: PostImage[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityUser {
  communityUserId: number;
  userId: number;
  communityId: number;
  nickName: string;
  createdAt: Date;
  updatedAt: Date;
}
