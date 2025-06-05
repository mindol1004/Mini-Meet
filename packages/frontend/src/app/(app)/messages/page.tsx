"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    profileImage?: string;
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    sentAt: string;
    isRead: boolean;
    isOwnMessage: boolean;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  sentAt: string;
  isOwnMessage: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Mock conversations data until backend is connected
  const mockConversations: Conversation[] = [
    {
      id: "1",
      user: {
        id: "101",
        username: "sarahjohnson",
        displayName: "Sarah Johnson",
        profileImage: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150",
        isOnline: true,
      },
      lastMessage: {
        content: "That sounds great! Let's meet at the cafe tomorrow.",
        sentAt: new Date(Date.now() - 900000).toISOString(),
        isRead: true,
        isOwnMessage: false,
      },
      unreadCount: 0,
    },
    {
      id: "2",
      user: {
        id: "102",
        username: "mikebrown",
        displayName: "Mike Brown",
        profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        isOnline: false,
      },
      lastMessage: {
        content: "Hey, did you see my new design?",
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        isOwnMessage: true,
      },
      unreadCount: 2,
    },
    {
      id: "3",
      user: {
        id: "103",
        username: "amylee",
        displayName: "Amy Lee",
        profileImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        isOnline: true,
      },
      lastMessage: {
        content: "Thanks for the feedback on my presentation!",
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        isOwnMessage: false,
      },
      unreadCount: 0,
    },
  ];
  
  // Mock messages for the selected conversation
  const mockMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        content: "Hi Sarah! How are you doing?",
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        isOwnMessage: true,
        status: 'read',
      },
      {
        id: "m2",
        content: "I'm doing great, thanks for asking! How about you?",
        sentAt: new Date(Date.now() - 3300000).toISOString(),
        isOwnMessage: false,
        status: 'read',
      },
      {
        id: "m3",
        content: "I was thinking about grabbing coffee tomorrow. Would you like to join?",
        sentAt: new Date(Date.now() - 3000000).toISOString(),
        isOwnMessage: true,
        status: 'read',
      },
      {
        id: "m4",
        content: "That sounds great! Let's meet at the cafe tomorrow.",
        sentAt: new Date(Date.now() - 900000).toISOString(),
        isOwnMessage: false,
        status: 'read',
      },
    ],
    "2": [
      {
        id: "m5",
        content: "Hey Mike, I finished the project we discussed.",
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        isOwnMessage: true,
        status: 'read',
      },
      {
        id: "m6",
        content: "Great job! Can you send me the files?",
        sentAt: new Date(Date.now() - 82800000).toISOString(),
        isOwnMessage: false,
        status: 'read',
      },
      {
        id: "m7",
        content: "Sure, I'll share them right away.",
        sentAt: new Date(Date.now() - 79200000).toISOString(),
        isOwnMessage: true,
        status: 'read',
      },
      {
        id: "m8",
        content: "Hey, did you see my new design?",
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        isOwnMessage: false,
        status: 'delivered',
      },
    ],
  };
  
  // Replace with real API calls when backend is ready
  const { data: conversations, isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      // Uncomment when backend is ready
      // const { data } = await api.get("/messages/conversations");
      // return data;
      return new Promise<Conversation[]>(resolve => {
        setTimeout(() => resolve(mockConversations), 500);
      });
    },
  });
  
  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      // Uncomment when backend is ready
      // const { data } = await api.get(`/messages/conversations/${selectedConversation.id}`);
      // return data;
      return new Promise<Message[]>(resolve => {
        setTimeout(() => resolve(mockMessages[selectedConversation.id] || []), 300);
      });
    },
    enabled: !!selectedConversation,
  });
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;
    
    // Here we would call the API to send the message
    // api.post(`/messages/conversations/${selectedConversation.id}`, {
    //   content: messageText
    // });
    
    // For now, just clear the input
    setMessageText("");
  };
  
  return (
    <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-80px)] flex flex-col mt-8 md:mt-0">
      <h1 className="text-2xl font-bold mb-6 md:hidden">Messages</h1>
      
      <div className="flex h-full rounded-xl border border-border overflow-hidden bg-card">
        {/* Conversation list */}
        <div className="w-full md:w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations" 
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    }
                  }
                }}
              >
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 hover:bg-secondary/50 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-secondary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={conversation.user.profileImage} 
                            alt={conversation.user.displayName || conversation.user.username} 
                          />
                          <AvatarFallback className="bg-secondary">
                            {(conversation.user.displayName?.[0] || conversation.user.username[0]).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium truncate">
                            {conversation.user.displayName || conversation.user.username}
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(conversation.lastMessage.sentAt), "h:mm a")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {conversation.lastMessage.isOwnMessage && "You: "}
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div>
                  <p className="text-muted-foreground mb-4">No conversations yet</p>
                  <Button size="sm">Start a new chat</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Conversation detail */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 flex justify-between items-center border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage 
                      src={selectedConversation.user.profileImage} 
                      alt={selectedConversation.user.displayName || selectedConversation.user.username}
                    />
                    <AvatarFallback>
                      {(selectedConversation.user.displayName?.[0] || selectedConversation.user.username[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedConversation.user.displayName || selectedConversation.user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.user.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton className={`h-10 w-48 ${i % 2 === 0 ? 'rounded-r-xl rounded-bl-xl' : 'rounded-l-xl rounded-br-xl'}`} />
                      </div>
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[70%] p-3 ${
                          message.isOwnMessage
                            ? 'bg-primary text-primary-foreground rounded-l-xl rounded-br-xl'
                            : 'bg-secondary rounded-r-xl rounded-bl-xl'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {format(new Date(message.sentAt), "h:mm a")}
                          {message.isOwnMessage && (
                            <span className="ml-1">
                              {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </p>
                      </motion.div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div className="max-w-md">
                <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                <p className="text-muted-foreground">
                  Choose a conversation from the list or start a new one to begin messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}