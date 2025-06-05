"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";
import { api } from "@/lib/api";
import { Post, Comment } from "@/types/post";
import { PostCard } from "@/components/post/post-card";
import { CommentItem } from "@/components/post/comment-item";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  // Mock post data until backend is connected
  const mockPost: Post = {
    id: id as string,
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
    },
    mediaFiles: [],
    reactionCount: 24,
    commentCount: 5,
    hasReacted: false,
    isEdited: false
  };

  // Mock comments
  const mockComments: Comment[] = [
    {
      id: "c1",
      content: "This looks amazing! Great work on the portfolio.",
      authorId: "2",
      author: {
        id: "2",
        username: "webdev",
        displayName: "Jessica Park",
        profileImage: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150",
        isVerified: false,
      },
      postId: id as string,
      isEdited: false,
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      updatedAt: new Date(Date.now() - 3000000).toISOString(),
      reactionCount: 5,
      hasReacted: true,
    },
    {
      id: "c2",
      content: "I love the design choices. What technologies did you use to build it?",
      authorId: "3",
      author: {
        id: "3",
        username: "techguru",
        displayName: "Michael Johnson",
        profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        isVerified: true,
      },
      postId: id as string,
      isEdited: false,
      createdAt: new Date(Date.now() - 2500000).toISOString(),
      updatedAt: new Date(Date.now() - 2500000).toISOString(),
      reactionCount: 2,
      hasReacted: false,
    }
  ];

  // Replace with real API call when backend is ready
  const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      // Uncomment when backend is ready
      // const { data } = await api.get(`/posts/${id}`);
      // return data;
      return new Promise<Post>(resolve => {
        setTimeout(() => resolve(mockPost), 500);
      });
    },
  });

  // Replace with real API call when backend is ready
  const { data: comments, isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: ["post", id, "comments"],
    queryFn: async () => {
      // Uncomment when backend is ready
      // const { data } = await api.get(`/posts/${id}/comments`);
      // return data;
      return new Promise<Comment[]>(resolve => {
        setTimeout(() => resolve(mockComments), 700);
      });
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // Uncomment when backend is ready
      // await api.post(`/posts/${id}/comments`, { content: commentText });
      setCommentText("");
      // Refetch comments
      // queryClient.invalidateQueries({ queryKey: ["post", id, "comments"] });
      
      // For now, just clear the input
      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Post</h1>
        </div>
        
        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/feed")}>Return to Feed</Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Post</h1>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PostCard post={post} />
      </motion.div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        
        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user?.profileImage} 
                alt={user?.displayName || user?.username} 
              />
              <AvatarFallback className="bg-secondary">
                {(user?.displayName?.[0] || user?.username?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex">
              <Textarea
                placeholder="Write a comment..."
                className="flex-1 resize-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" className="ml-2 mt-auto" disabled={!commentText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        
        {/* Comments list */}
        {isLoadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                  <div className="mt-2 flex gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                }
              }
            }}
            className="space-y-6"
          >
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <CommentItem comment={comment} postId={post.id} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}