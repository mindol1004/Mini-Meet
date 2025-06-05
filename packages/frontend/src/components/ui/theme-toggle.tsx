"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
        style={{ display: theme === "light" ? "block" : "none" }}
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
        style={{ display: theme === "dark" ? "block" : "none" }}
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </Button>
  );
}