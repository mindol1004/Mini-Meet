"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Heart, Reply, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/post";
import Link from "next/link";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.hasReacted);
  const [likeCount, setLikeCount] = useState(comment.reactionCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    // Here we would call the API to like/unlike the comment
    // api.post(`/comments/${comment.id}/react`, { type: "LIKE" });
  };
  
  const getTimeLabel = () => {
    const date = new Date(comment.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, yyyy");
    }
  };
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // Here we would call the API to submit the reply
    // api.post(`/posts/${postId}/comments`, { 
    //   content: replyText,
    //   parentId: comment.id
    // });
    
    setReplyText("");
    setShowReplyForm(false);
  };
  
  return (
    <div className="group">
      <div className="flex gap-3">
        <Link href={`/profile/${comment.author.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={comment.author.profileImage} 
              alt={comment.author.displayName || comment.author.username} 
            />
            <AvatarFallback className="bg-secondary">
              {(comment.author.displayName?.[0] || comment.author.username[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1">
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Link href={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                {comment.author.displayName || comment.author.username}
              </Link>
              {comment.author.isVerified && (
                <div className="bg-primary rounded-full p-0.5 flex items-center justify-center">
                  <Check className="h-2 w-2 text-white" />
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-1">@{comment.author.username}</span>
            </div>
            <p className="whitespace-pre-line">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  className={cn(
                    "h-3.5 w-3.5", 
                    isLiked ? "fill-red-500 text-red-500" : ""
                  )} 
                />
              </motion.div>
              {likeCount > 0 && (
                <span className={cn(isLiked && "text-red-500")}>{likeCount}</span>
              )}
            </button>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Reply className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
            
            <span className="text-xs text-muted-foreground">{getTimeLabel()}</span>
          </div>
          
          {showReplyForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-2"
              onSubmit={handleSubmitReply}
            >
              <div className="flex gap-2">
                <textarea
                  placeholder="Write a reply..."
                  className="flex-1 p-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] max-h-[120px]"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReplyForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
          
          {/* Nested replies would go here */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-2 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}