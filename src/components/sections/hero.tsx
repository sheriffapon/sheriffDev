
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ArrowRight, Code } from "lucide-react"

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <div className="container grid lg:grid-cols-2 items-center gap-12 py-20 md:py-32">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-4">
            <Code className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-balance">
            Sheriff Abdulraheem
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground text-balance">
            Full Stack Developer & Creative Technologist building modern, responsive web applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button size="lg" asChild className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
              <Link href="#contact">
                Hire Me <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="https://github.com/sheriffapon" target="_blank" rel="noopener noreferrer">
                    GitHub
                </Link>
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
            {heroImage && (
                <div className="relative w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/20">
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
