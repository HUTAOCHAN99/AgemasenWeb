import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { ServerActivity } from "@/components/ServerActivity";
import { BotPreview } from "@/components/BotPreview";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowToUse } from "@/components/HowToUse";
import { Mascot } from "@/components/Mascot";
import { Navbar } from "@/components/Navbar";
import { getMascotArt } from "@/lib/art";

export default function Home() {
  const art = getMascotArt();

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero art={art} />
        <About />
        <Features />
        <BotPreview />
        <Mascot art="/image/profile.png" />
        <HowToUse />
        <ServerActivity />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
