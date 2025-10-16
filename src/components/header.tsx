
"use client"

import Link from "next/link"
import { Menu, Mail, Github } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { AnimatedLogo } from "./animated-logo"
import { motion }from "framer-motion"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const sheriffDevText = "SheriffDev".split("");
  
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <AnimatedLogo className="h-7 w-7"/>
          <motion.div
             className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary"
             variants={textVariants}
             initial="hidden"
             animate="visible"
           >
             {sheriffDevText.map((char, index) => (
               <motion.span
                key={index}
                variants={charVariants}
                style={{display: 'inline-block'}}
                transition={{
                    delay: index * 0.1
                }}
              >
                 {char}
               </motion.span>
             ))}
           </motion.div>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-1">
          <nav className="hidden items-center space-x-5 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <div key={href} className="relative group/nav-item">
                 <Link
                  href={href}
                  className="transition-colors hover:text-primary text-xs"
                >
                  {label}
                </Link>
                <motion.div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full opacity-0 group-hover/nav-item:opacity-100"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            ))}
          </nav>
          <div className="hidden items-center gap-1 md:flex">
             <Button variant="outline" size="sm" asChild className="shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/20 transition-shadow">
                <a href="https://github.com/sheriffapon" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-3.5 w-3.5" />
                    GitHub
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/20 transition-shadow">
                <a href="mailto:sheriffapon@gmail.com">
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Email
                </a>
            </Button>
          </div>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5"/>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card/60 backdrop-blur-xl border-white/10 w-[240px] sm:w-[280px]">
              <nav className="grid gap-4 text-base font-medium mt-8">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" asChild>
                      <a href="https://github.com/sheriffapon" target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                      </a>
                  </Button>
                  <Button variant="outline" asChild>
                      <a href="mailto:sheriffabdulraheemafunsho23@gmail.com">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                      </a>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
