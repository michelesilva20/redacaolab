import { Hero } from './Hero';
import { TrustLogos } from './TrustLogos';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Pricing } from './Pricing';
import { CTA } from './CTA';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Header } from './Header';

export function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TrustLogos />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
