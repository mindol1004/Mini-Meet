"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name cannot exceed 50 characters").optional(),
  firstName: z.string().max(50, "First name cannot exceed 50 characters").optional().or(z.literal("")),
  lastName: z.string().max(50, "Last name cannot exceed 50 characters").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").max(255, "Website URL cannot exceed 255 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const securitySchema = z.object({
  isPrivate: z.boolean().default(false),
  currentPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
}).refine(data => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profileImage || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user?.coverImage || null);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      website: user?.website || "",
      location: user?.location || "",
    },
  });
  
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      isPrivate: user?.isPrivate || false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmitProfile = async (values: ProfileFormValues) => {
    setIsSubmittingProfile(true);
    
    try {
      // Here we would upload images and update profile
      // const formData = new FormData();
      // if (profileImage) {
      //   formData.append('profileImage', profileImage);
      // }
      // if (coverImage) {
      //   formData.append('coverImage', coverImage);
      // }
      // 
      // // If there are images to upload
      // if (profileImage || coverImage) {
      //   const { data: uploadedImages } = await api.post('/uploads/profile', formData);
      // }
      // 
      // // Update profile data
      // await api.patch('/users/me', values);
      
      // For now, just simulate success
      setTimeout(() => {
        toast.success("Profile updated successfully");
        setIsSubmittingProfile(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      setIsSubmittingProfile(false);
    }
  };
  
  const onSubmitSecurity = async (values: SecurityFormValues) => {
    setIsSubmittingSecurity(true);
    
    try {
      // Here we would update security settings
      // const securityUpdate: any = {
      //   isPrivate: values.isPrivate
      // };
      // 
      // if (values.newPassword) {
      //   securityUpdate.currentPassword = values.currentPassword;
      //   securityUpdate.newPassword = values.newPassword;
      // }
      // 
      // await api.patch('/users/me/security', securityUpdate);
      
      // For now, just simulate success
      setTimeout(() => {
        toast.success("Security settings updated successfully");
        setIsSubmittingSecurity(false);
        
        // Reset password fields
        securityForm.reset({
          ...values,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to update security settings");
      setIsSubmittingSecurity(false);
    }
  };
  
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Tabs defaultValue="profile">
          <div className="p-4 md:p-6 border-b border-border">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="p-4 md:p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Profile Images</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={profilePreview || undefined}
                        alt="Profile picture" 
                      />
                      <AvatarFallback className="text-2xl bg-secondary">
                        {user?.displayName?.[0] || user?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('profile-image')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <FormLabel>Cover Image</FormLabel>
                  <div className="mt-2">
                    <div className="aspect-video rounded-lg overflow-hidden bg-secondary relative">
                      {coverPreview ? (
                        <img 
                          src={coverPreview} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          No cover image
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <Input
                        id="cover-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImageChange}
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cover-image')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Cover
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Display Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is how your name will appear on your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself" 
                          className="resize-none min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="security" className="p-4 md:p-6 space-y-6">
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                <h2 className="text-xl font-semibold">Privacy Settings</h2>
                
                <FormField
                  control={securityForm.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Private Profile</FormLabel>
                        <FormDescription>
                          When enabled, only approved followers can see your posts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <h2 className="text-xl font-semibold pt-4">Change Password</h2>
                
                <div className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter current password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingSecurity}>
                    {isSubmittingSecurity ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Security Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}