import { HeroSection } from "@/components/home/hero-section";
import { FeaturedTuitions } from "@/components/home/featured-tuitions";
import { PopularSubjects } from "@/components/home/popular-subjects";
import { StatsSection } from "@/components/home/stats-section";
import {
  HomeCallToAction,
  HomePricing,
  HowItWorks,
  Testimonials,
} from "@/components/home/landing-sections";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedTuitions />
      <HomePricing />
      <HowItWorks />
      <PopularSubjects />
      <StatsSection />
      <Testimonials />
      <HomeCallToAction />
    </main>
  );
}
