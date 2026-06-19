import { MarketingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { CompaniesSection } from "@/components/landing/companies";
import { FeaturesSection } from "@/components/landing/features";
import { StatsSection } from "@/components/landing/stats";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing";
import { FaqSection } from "@/components/landing/faq";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <MarketingNavbar />
      <main className="flex-1">
        <HeroSection />
        <CompaniesSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
