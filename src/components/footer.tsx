
import Link from "next/link"
import { Button } from "./ui/button"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

const socialLinks = [
  { name: "GitHub", url: "https://github.com/sheriffapon", icon: <Github /> },
  { name: "LinkedIn", url: "https://linkedin.com/in/Sheriff SA", icon: <Linkedin /> },
  { name: "X (Twitter)", url: "https://x.com/aponwy", icon: <Twitter /> },
  { name: "Instagram", url: "https://instagram.com/Al aponwy Darweesh", icon: <Instagram /> },
]

export function Footer() {
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
        </div>
      </div>
    </footer>
  )
}
