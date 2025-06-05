"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Globe, Edit, Users } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types/user";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.username === username;
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Mock profile data until backend is connected
  const mockProfile: User = {
    id: "1",
    username: username as string,
    email: "alex@example.com",
    displayName: "Alex Chen",
    firstName: "Alex",
    lastName: "Chen",
    profileImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverImage: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1280",
    bio: "UX Designer & Web Developer | Creating beautiful digital experiences | Coffee enthusiast ☕",
    website: "https://alexchen.design",
    location: "San Francisco, CA",
    isVerified: true,
    isPrivate: false,
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
  };
  
  // Mock posts data until backend is connected
  const mockPosts: Post[] = [
    {
      id: "1",
      content: "Just launched my new portfolio website! Check it out at my profile. #webdev #portfolio",
      type: "TEXT",
      visibility: "PUBLIC",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      author: mockProfile,
      mediaFiles: [],
      reactionCount: 24,
      commentCount: 5,
      hasReacted: false,
      isEdited: false,
    },
    {
      id: "2",
      content: "Working on some new UI designs. What do you think?",
      type: "IMAGE",
      visibility: "PUBLIC",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      author: mockProfile,
      mediaFiles: [
        {
          id: "101",
          url: "https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=1000",
          type: "IMAGE",
        }
      ],
      reactionCount: 87,
      commentCount: 12,
      hasReacted: true,
      isEdited: false,
    }
  ];
  
  // Replace with real API calls when backend is ready
  const { data: profile, isLoading: isLoadingProfile } = useQuery<User>({
    queryKey: ["profile", username],
    queryFn: async () => {
      // Uncomment when backend is ready
      // const { data } = await api.get(`/users/${username}`);
      // return data;
      return new Promise<User>(resolve => {
        setTimeout(() => resolve(mockProfile), 500);
      });
    },
  });
  
  const { data: posts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ["profile", username, "posts"],
    queryFn: async () => {
      // Uncomment when backend is ready
      // const { data } = await api.get(`/users/${username}/posts`);
      // return data;
      return new Promise<Post[]>(resolve => {
        setTimeout(() => resolve(mockPosts), 700);
      });
    },
  });
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    
    // Here we would call the API to follow/unfollow
    // if (!isFollowing) {
    //   api.post(`/users/${profile?.id}/follow`);
    // } else {
    //   api.delete(`/users/${profile?.id}/follow`);
    // }
  };
  
  if (isLoadingProfile) {
    return (
      <div className="py-8">
        <div className="relative">
          <Skeleton className="w-full h-56 rounded-xl" />
          <div className="absolute -bottom-16 left-8">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          </div>
        </div>
        
        <div className="mt-20 flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const joinDate = format(new Date(profile.createdAt), "MMMM yyyy");
  
  return (
    <div className="py-8">
      {/* Cover image */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-56 md:h-72 rounded-xl overflow-hidden bg-secondary"
        >
          {profile.coverImage && (
            <img 
              src={profile.coverImage} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          )}
        </motion.div>
        
        {/* Profile picture */}
        <motion.div 
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -bottom-16 left-8"
        >
          <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-secondary">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.displayName || profile.username} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/20">
                <span className="text-primary text-4xl font-medium">
                  {(profile.displayName?.[0] || profile.username[0]).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Profile info */}
      <div className="mt-20 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{profile.displayName || profile.username}</h1>
            {profile.isVerified && (
              <div className="bg-primary rounded-full p-1">
                <Users className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
          <p className="text-muted-foreground">@{profile.username}</p>
          
          {profile.bio && (
            <p className="mt-4 whitespace-pre-line">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {profile.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            )}
            
            {profile.website && (
              <div className="flex items-center text-muted-foreground">
                <Globe className="h-4 w-4 mr-1" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {joinDate}
            </div>
          </div>
          
          <div className="flex gap-6 mt-6">
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-1"
            >
              <span className="font-bold">258</span>
              <span className="text-muted-foreground text-sm">Following</span>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-1"
            >
              <span className="font-bold">1.2k</span>
              <span className="text-muted-foreground text-sm">Followers</span>
            </motion.div>
          </div>
        </div>
        
        <div className="sm:ml-auto">
          {isOwnProfile ? (
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "outline" : "default"}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs for Posts, Media, Likes */}
      <Tabs defaultValue="posts" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {isLoadingPosts ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4 flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-6"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="media">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts?.filter(post => 
              post.mediaFiles && post.mediaFiles.length > 0
            ).map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.03 }}
                className="aspect-square rounded-lg overflow-hidden bg-secondary relative"
              >
                <img 
                  src={post.mediaFiles[0].url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="secondary" size="sm">View</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="likes">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Liked posts will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}