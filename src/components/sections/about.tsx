
import { SectionTitle } from "../section-title"

export function AboutSection() {
  return (
    <section id="about" className="bg-secondary">
      <div className="container">
        <SectionTitle>About Me</SectionTitle>
        <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            I am a passionate Full Stack Developer with a knack for creating dynamic, user-friendly web applications. With expertise in the MERN stack (MongoDB, Express, React, Node.js) and a love for elegant design using TailwindCSS, I bring ideas to life from concept to deployment. I thrive on solving complex problems and am dedicated to writing clean, efficient, and maintainable code. Whether it's building a robust back-end or a beautiful, responsive front-end, I am committed to delivering high-quality digital experiences.
            </p>
        </div>
      </div>
    </section>
  )
}
