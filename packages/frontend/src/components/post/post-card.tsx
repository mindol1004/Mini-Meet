"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.hasReacted);
  const [likeCount, setLikeCount] = useState(post.reactionCount);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    // Here we would call the API to like/unlike the post
    // api.post(`/posts/${post.id}/react`, { type: "LIKE" });
  };
  
  const getTimeLabel = () => {
    const date = new Date(post.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d");
    }
  };
  
  const renderMedia = () => {
    if (!post.mediaFiles || post.mediaFiles.length === 0) return null;
    
    const mediaFile = post.mediaFiles[0];
    
    switch (mediaFile.type) {
      case "IMAGE":
        return (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={mediaFile.url}
              alt={mediaFile.altText || "Post image"}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        );
      case "VIDEO":
        return (
          <div className="mt-3 rounded-lg overflow-hidden">
            <video
              src={mediaFile.url}
              controls
              className="w-full h-auto max-h-[500px]"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderLinkPreview = () => {
    if (post.type !== "LINK" || !post.linkUrl) return null;
    
    return (
      <div className="mt-3 border border-border rounded-lg overflow-hidden">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium line-clamp-1">{post.linkTitle || post.linkUrl}</h3>
            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
          {post.linkDescription && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {post.linkDescription}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-card border border-border rounded-xl overflow-hidden"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="p-4">
        {/* Post header */}
        <div className="flex items-center justify-between mb-3">
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-2 group">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage 
                src={post.author.profileImage} 
                alt={post.author.displayName || post.author.username} 
              />
              <AvatarFallback className="bg-secondary">
                {(post.author.displayName?.[0] || post.author.username[0]).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium group-hover:underline">
                  {post.author.displayName || post.author.username}
                </p>
                {post.author.isVerified && (
                  <div className="bg-primary rounded-full p-0.5 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>@{post.author.username}</span>
                <span className="mx-1">•</span>
                <span>{getTimeLabel()}</span>
              </div>
            </div>
          </Link>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post content */}
        <div>
          {post.content && (
            <p className="whitespace-pre-line mb-3">{post.content}</p>
          )}
          
          {renderMedia()}
          {renderLinkPreview()}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Link 
                  href={`/tags/${tag}`} 
                  key={tag}
                  className="text-primary text-sm hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Post actions */}
      <div className="p-2 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={handleLike}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              className={cn(
                "h-4 w-4", 
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </motion.div>
          <span className={cn(isLiked && "text-red-500")}>{likeCount}</span>
        </Button>

        <Link href={`/posts/${post.id}`} className="flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full gap-2"
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span>{post.commentCount}</span>
          </Button>
        </Link>

        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2"
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span>Share</span>
        </Button>
      </div>
    </motion.div>
  );
}