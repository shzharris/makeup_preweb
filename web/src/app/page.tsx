import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PriceSelect } from "@/components/PriceSelect";

export default function Home() {
  return (
    <main role="main">
      <Hero />
      <Features />
      <PriceSelect />
    </main>
  );
}
