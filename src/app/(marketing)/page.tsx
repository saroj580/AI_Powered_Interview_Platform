import { HeroSection } from "@/components/landing/hero";
import { CompaniesSection } from "@/components/landing/companies";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing";
import { FaqSection } from "@/components/landing/faq";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <CompaniesSection />
            <FeaturesSection />
            <HowItWorksSection />
            <StatsSection />
            <TestimonialsSection />
            <PricingSection />
            <FaqSection />
            <CtaBanner />
        </>
    );
}