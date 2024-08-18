export interface Community {
    communityId: number;
    communityName: string;
    description: string;
    membershipPrice: number;
    communityLogoImage: string;
    communityCoverImage: string;
    createdAt:string;
  }

  interface PostImage {
    postImageId: number;
    postImageUrl: string;
  }
  
  export interface Post {
    postId: number;
    nickname:string;
    content: string;
    profileImage:string;
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

  export interface User {
    id: number,
    email: string,
    name: string,
    profileImage: string,
    role: string,
  }
  