
'use client';

import Link from "next/link"
import { Button } from "./ui/button"
import { Github, Linkedin, Twitter, Instagram, LogOut } from "lucide-react"
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/sheriffapon", icon: <Github /> },
  { name: "LinkedIn", url: "https://linkedin.com/in/Sheriff SA", icon: <Linkedin /> },
  { name: "X (Twitter)", url: "https://x.com/aponwy", icon: <Twitter /> },
  { name: "Instagram", url: "https://instagram.com/Al aponwy Darweesh", icon: <Instagram /> },
]

const ADMIN_EMAIL = "sheriffabdulraheemafunsho23@gmail.com";

export function Footer() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "There was a problem signing out.",
      });
    }
  };

  return (
    <footer className="bg-secondary border-t">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sheriff Abdulraheem. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="ghost"
              size="icon"
              asChild
              aria-label={social.name}
            >
              <Link href={social.url} target="_blank" rel="noopener noreferrer">
                {social.icon}
              </Link>
            </Button>
          ))}
          {isAdmin && (
             <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut />
              </Button>
          )}
        </div>
      </div>
    </footer>
  )
}
