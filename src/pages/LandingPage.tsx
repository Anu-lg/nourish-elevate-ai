import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { HowItWorks } from "@/components/HowItWorks";
import { Personalization } from "@/components/Personalization";
import { AISection } from "@/components/AISection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <HowItWorks />
        <Personalization />
        <AISection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
