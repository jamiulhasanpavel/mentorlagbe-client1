import { HeroSection } from "@/components/home/hero-section";
import { FeaturedTuitions } from "@/components/home/featured-tuitions";
import { PopularSubjects } from "@/components/home/popular-subjects";
import { StatsSection } from "@/components/home/stats-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <PopularSubjects />
      <FeaturedTuitions />
    </main>
  );
}
