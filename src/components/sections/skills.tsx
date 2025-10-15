
import { Card, CardContent } from "@/components/ui/card"
import { SectionTitle } from "../section-title"
import {
  HtmlIcon,
  CssIcon,
  JavaScriptIcon,
  ReactIcon,
  NodeJsIcon,
  ExpressIcon,
  MongoDbIcon,
  PythonIcon,
  GitIcon,
  TailwindCssIcon,
  NextJsIcon,
} from "../icons"

const skills = [
  { name: "HTML", icon: <HtmlIcon /> },
  { name: "CSS", icon: <CssIcon /> },
  { name: "JavaScript", icon: <JavaScriptIcon /> },
  { name: "React", icon: <ReactIcon /> },
  { name: "Next.js", icon: <NextJsIcon /> },
  { name: "Node.js", icon: <NodeJsIcon /> },
  { name: "Express", icon: <ExpressIcon /> },
  { name: "MongoDB", icon: <MongoDbIcon /> },
  { name: "Python", icon: <PythonIcon /> },
  { name: "TailwindCSS", icon: <TailwindCssIcon /> },
  { name: "Git", icon: <GitIcon /> },
]

export function SkillsSection() {
  return (
    <section id="skills" className="bg-secondary">
      <div className="container">
        <SectionTitle>Core Technologies</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {skills.map((skill) => (
            <Card key={skill.name} className="group flex flex-col items-center justify-center p-6 transition-all duration-300 hover:bg-card-foreground/5 hover:shadow-lg hover:-translate-y-2">
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <div className="h-12 w-12 text-muted-foreground transition-colors group-hover:text-primary">
                  {skill.icon}
                </div>
                <p className="font-semibold text-sm text-center">{skill.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
