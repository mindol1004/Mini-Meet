export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  website?: string;
  location?: string;
  isVerified: boolean;
  isPrivate: boolean;
  isActive: boolean;
  createdAt: string;
}