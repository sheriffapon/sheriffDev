
import { SectionTitle } from "../section-title"
import { ContactForm } from "../contact-form"
import { Card } from "../ui/card"

export function ContactSection() {
  return (
    <section id="contact">
      <div className="container">
        <SectionTitle>Get In Touch</SectionTitle>
        <Card className="max-w-2xl mx-auto p-6 md:p-8 bg-card/60 backdrop-blur-xl border-white/10">
          <p className="text-center text-muted-foreground mb-8">
            Have a project in mind or just want to say hello? Fill out the form below, and I'll get back to you as soon as possible.
          </p>
          <ContactForm />
        </Card>
      </div>
    </section>
  )
}
