
import { SectionTitle } from "../section-title"
import { Card } from "../ui/card"
import { AnimatedText } from "../animated-text"

export function AboutSection() {
  const aboutText = "I am a passionate Full Stack Developer with a knack for creating dynamic, user-friendly web applications. With expertise in the MERN stack (MongoDB, Express, React, Node.js) and a love for elegant design using TailwindCSS, I bring ideas to life from concept to deployment. I thrive on solving complex problems and am dedicated to writing clean, efficient, and maintainable code. Whether it's building a robust back-end or a beautiful, responsive front-end, I am committed to delivering high-quality digital experiences.";

  return (
    <section id="about">
      <div className="container">
        <SectionTitle>About Me</SectionTitle>
        <Card className="max-w-3xl mx-auto p-5 md:p-6 bg-card/60 backdrop-blur-xl border-white/10">
          <AnimatedText 
            text={aboutText}
            className="text-base text-center text-muted-foreground text-balance leading-relaxed"
          />
        </Card>
      </div>
    </section>
  )
}
