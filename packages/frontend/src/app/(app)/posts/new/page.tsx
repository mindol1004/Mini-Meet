"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Image, Link, Globe, Users, Lock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";

const postSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").max(2000, "Post content cannot exceed 2000 characters"),
  visibility: z.enum(["PUBLIC", "FRIENDS_ONLY", "PRIVATE"]),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      visibility: "PUBLIC",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 4 images
      const newFiles = filesArray.slice(0, 4);
      
      setSelectedImages([...selectedImages, ...newFiles].slice(0, 4));
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls].slice(0, 4));
    }
  };
  
  const removeImage = (index: number) => {
    // Remove the file and preview URL
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here we would send the post data to the API
      // if (selectedImages.length > 0) {
      //   // Upload images first and get their URLs
      //   const formData = new FormData();
      //   selectedImages.forEach(file => formData.append('files', file));
      //   
      //   const { data: mediaFiles } = await api.post('/uploads', formData);
      //   
      //   // Then create the post with the media files
      //   await api.post('/posts', {
      //     ...values,
      //     mediaFiles: mediaFiles.map(file => file.id)
      //   });
      // } else {
      //   // Create post without media
      //   await api.post('/posts', values);
      // }
      
      // For now, just simulate a successful post
      setTimeout(() => {
        toast.success("Post created successfully");
        router.push("/feed");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityOptions = [
    {
      value: "PUBLIC",
      label: "Public",
      icon: Globe,
      description: "Anyone on Connectify can see this post",
    },
    {
      value: "FRIENDS_ONLY",
      label: "Friends Only",
      icon: Users,
      description: "Only your connections can see this post",
    },
    {
      value: "PRIVATE",
      label: "Private",
      icon: Lock,
      description: "Only you can see this post",
    },
  ];

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl border border-border p-4 md:p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user?.profileImage} 
              alt={user?.displayName || user?.username} 
            />
            <AvatarFallback className="bg-secondary">
              {(user?.displayName?.[0] || user?.username?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="font-medium">
              {user?.displayName || user?.username}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visibilityOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="What's on your mind?"
                          className="min-h-[120px] resize-none text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Image previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                        <img 
                          src={url} 
                          alt={`Upload preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
                        >
                          <span className="sr-only">Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      className="relative"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Image className="h-4 w-4" />
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageChange}
                        disabled={selectedImages.length >= 4}
                      />
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}