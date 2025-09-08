import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingGrid } from "@/components/PricingGrid";

export default function Home() {
  return (
    <main role="main">
      <Hero />
      <Features />
      <PricingGrid />
    </main>
  );
}
