export interface Community {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    logoUrl: string;
    coverUrl: string;
  }

  interface PostImage {
    postImageId: number;
    postImageUrl: string;
  }
  
  export interface Post {
    postId: number;
    // author: string;
    communityUserId:number
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
  