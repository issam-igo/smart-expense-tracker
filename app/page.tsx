import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <DashboardPreview />
        <BenefitsSection />
      </main>
      <SiteFooter />
    </>
  );
}
