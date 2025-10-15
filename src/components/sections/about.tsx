
import { SectionTitle } from "../section-title"
import { Card } from "../ui/card"

export function AboutSection() {
  return (
    <section id="about">
      <div className="container">
        <SectionTitle>About Me</SectionTitle>
        <Card className="max-w-4xl mx-auto p-6 md:p-8 bg-card/80 backdrop-blur-sm">
          <p className="text-lg text-center text-muted-foreground text-balance leading-relaxed">
            I am a passionate Full Stack Developer with a knack for creating dynamic, user-friendly web applications. With expertise in the MERN stack (MongoDB, Express, React, Node.js) and a love for elegant design using TailwindCSS, I bring ideas to life from concept to deployment. I thrive on solving complex problems and am dedicated to writing clean, efficient, and maintainable code. Whether it's building a robust back-end or a beautiful, responsive front-end, I am committed to delivering high-quality digital experiences.
          </p>
        </Card>
      </div>
    </section>
  )
}
