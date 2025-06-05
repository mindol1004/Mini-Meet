"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Compass, MessageCircle, Users, Image, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // If user is logged in, redirect to feed
  if (user && !isLoading) {
    router.push("/feed");
  }
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Users className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary">Connectify</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="flex-1"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Connect, Share, and Discover
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Join our vibrant community where you can share moments, connect with friends, 
              and discover exciting content tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => router.push('/register')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/about')}>
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-card/90 backdrop-blur-sm shadow-xl rounded-2xl -rotate-2 overflow-hidden border border-border">
                <div className="h-full w-full p-6 flex flex-col">
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                    <div className="w-12 h-12 rounded-full bg-secondary"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">@sarahj</p>
                    </div>
                  </div>
                  <p className="mb-4">Just visited the most amazing coffee shop in downtown! The atmosphere was incredible ✨</p>
                  <div className="rounded-lg overflow-hidden bg-muted aspect-video mb-4"></div>
                  <div className="mt-auto flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 text-sm">
                      <span className="h-1 w-1 rounded-full bg-primary"></span>
                      <span>24 likes</span>
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <span className="h-1 w-1 rounded-full bg-primary"></span>
                      <span>8 comments</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-24 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Connectify?</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Discover Content</h4>
              <p className="text-muted-foreground">
                Explore personalized content based on your interests and connections.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Real-time Chat</h4>
              <p className="text-muted-foreground">
                Connect instantly with friends through our seamless messaging system.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Rich Media Sharing</h4>
              <p className="text-muted-foreground">
                Share photos and videos easily with our intuitive media tools.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border md:col-span-2 lg:col-span-1"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Engagement</h4>
              <p className="text-muted-foreground">
                Connect with like-minded people and build meaningful relationships.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl p-6 shadow-sm border border-border md:col-span-2 lg:col-span-2"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Privacy Controls</h4>
              <p className="text-muted-foreground">
                Customize your privacy settings and control who sees your content with our advanced privacy features.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-card mt-24 border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Connectify</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Connectify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}