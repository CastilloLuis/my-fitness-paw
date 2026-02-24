import Activities from "@/components/activities";
import DownloadCta from "@/components/download-cta";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Activities />
        {/* <Stats /> */}
        <DownloadCta />
      </main>
      <Footer />
    </>
  );
}
