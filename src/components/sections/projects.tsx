
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Github, ExternalLink } from "lucide-react"
import { SectionTitle } from "../section-title"

const projects = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A full-featured online store with product catalogs, shopping cart, and a secure checkout process. Built with the MERN stack.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
    githubUrl: "https://github.com/sheriffapon",
    liveUrl: "#",
  },
  {
    id: "project-2",
    title: "Project Management Dashboard",
    description: "A responsive dashboard for teams to track tasks, monitor progress, and collaborate effectively. Features real-time updates.",
    techStack: ["React", "Python", "Flask", "PostgreSQL"],
    githubUrl: "https://github.com/sheriffapon",
    liveUrl: "#",
  },
  {
    id: "project-3",
    title: "Portfolio Website",
    description: "A personal portfolio to showcase my skills and projects, featuring a sleek design, animations, and a working contact form.",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion"],
    githubUrl: "https://github.com/sheriffapon",
    liveUrl: "#",
  },
  {
    id: "project-4",
    title: "Weather Forecast App",
    description: "A simple and elegant weather app that provides real-time weather data for any location using a third-party API.",
    techStack: ["React", "JavaScript", "CSS"],
    githubUrl: "https://github.com/sheriffapon",
    liveUrl: "#",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects">
      <div className="container">
        <SectionTitle>My Projects</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const projectImage = PlaceHolderImages.find(p => p.id === project.id);
            return (
              <Card key={project.id} className="flex flex-col overflow-hidden group bg-card/60 backdrop-blur-xl border-white/10">
                {projectImage && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={projectImage.imageUrl}
                      alt={project.title}
                      data-ai-hint={projectImage.imageHint}
                      width={800}
                      height={600}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="p-4">
                  <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
}
