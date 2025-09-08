import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingCTA } from "@/components/PricingCTA";

export default function Home() {
  return (
    <main role="main">
      <Hero />
      <Features />
      <PricingCTA />
    </main>
  );
}
