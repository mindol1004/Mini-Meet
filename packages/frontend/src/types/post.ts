import { User } from "./user";

export type Post = {
  id: string;
  content?: string;
  type: PostType;
  visibility: PostVisibility;
  authorId?: string;
  author: User;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  tags?: string[];
  mentionedUsers?: string[];
  isEdited: boolean;
  editedAt?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
  mediaFiles: MediaFile[];
  originalPostId?: string;
  originalPost?: Post;
  
  // Computed fields
  reactionCount: number;
  commentCount: number;
  hasReacted: boolean;
};

export type MediaFile = {
  id: string;
  url: string;
  type: MediaType;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
};

export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' | 'POLL';
export type PostVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
export type ReactionType = 'LIKE' | 'LOVE' | 'LAUGH' | 'ANGRY' | 'SAD' | 'WOW';

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  reactionCount: number;
  hasReacted: boolean;
  replies?: Comment[];
};