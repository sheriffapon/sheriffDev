
import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import { ReviewsSection } from "@/components/sections/reviews";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FadeIn>
          <AboutSection />
        </FadeIn>
        <FadeIn>
          <ProjectsSection />
        </FadeIn>
        <FadeIn>
          <ReviewsSection />
        </FadeIn>
        <FadeIn>
          <SkillsSection />
        </FadeIn>
        <FadeIn>
          <ContactSection />
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}
