"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Post } from "@/types/post";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

export default function FeedPage() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data } = await api.get("/posts/feed");
      return data;
    },
  });
  
  // Mock data until backend is connected
  const mockPosts: Post[] = [
    {
      id: "1",
      content: "Just launched my new portfolio website! Check it out at my profile. #webdev #portfolio",
      type: "TEXT",
      visibility: "PUBLIC",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      author: {
        id: "1",
        username: "designmaster",
        displayName: "Alex Chen",
        profileImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
        isVerified: true,
      } as User,
      mediaFiles: [],
      reactionCount: 24,
      commentCount: 5,
      hasReacted: false,
    },
    {
      id: "2",
      content: "Beautiful sunset at the beach today!",
      type: "IMAGE",
      visibility: "PUBLIC",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      author: {
        id: "2",
        username: "travelbug",
        displayName: "Maya Johnson",
        profileImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        isVerified: false,
      } as User,
      mediaFiles: [
        {
          id: "101",
          url: "https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?auto=compress&cs=tinysrgb&w=1000",
          type: "IMAGE",
        }
      ],
      reactionCount: 152,
      commentCount: 18,
      hasReacted: true,
    },
    {
      id: "3",
      content: "Just finished reading this amazing book. Highly recommend!",
      type: "TEXT",
      visibility: "PUBLIC",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      author: {
        id: "3",
        username: "bookworm",
        displayName: "Jamie Smith",
        profileImage: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
        isVerified: false,
      } as User,
      mediaFiles: [],
      reactionCount: 45,
      commentCount: 7,
      hasReacted: false,
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="py-8 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        {[1, 2, 3].map((i) => (
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
    );
  }

  // Use mock data until backend is connected
  const feedPosts = posts || mockPosts;

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {feedPosts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}