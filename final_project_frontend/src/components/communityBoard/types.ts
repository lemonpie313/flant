export interface Community {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    logoUrl: string;
    coverUrl: string;
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
  