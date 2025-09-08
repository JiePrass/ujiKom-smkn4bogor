import { HeroSection } from "@/components/landing/hero";
import { FeatureSection } from "@/components/landing/feature";
import EventSection from "@/components/landing/event";
import FAQSection from "@/components/landing/FAQ";
import ContactSection from "@/components/landing/contact";
import CTASection from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <EventSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
