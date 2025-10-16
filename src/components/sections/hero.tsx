
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ArrowRight } from "lucide-react"
import { AnimatedLogo } from "../animated-logo"

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <div className="container grid lg:grid-cols-2 items-center gap-10 py-16 md:py-24">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-4">
            <AnimatedLogo className="h-14 w-14" />
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-balance">
            SheriffDev👨🏽‍💻
          </h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground text-balance">
            Full Stack Developer & Creative Technologist building modern, responsive web applications.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Button asChild className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow btn-sand-shimmer">
              <Link href="#contact">
                Hire Me <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="https://github.com/sheriffapon" target="_blank" rel="noopener noreferrer">
                    GitHub
                </Link>
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
            {heroImage && (
                <div className="relative w-[220px] h-[220px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/20">
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                    />
                </div>
            )}
        </div>
      </div>
    </section>
  )
}
