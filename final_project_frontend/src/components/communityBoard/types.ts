export interface Community {
  communityId: number;
  communityName: string;
  memberCount: number;
  communityLogoImage: string;
  communityCoverImage: string;
  membershipPrice: number;
}

export interface Post {
  id: number;
  author: string;
  content: string;
  imageUrl?: string[];
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
export interface User {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}
