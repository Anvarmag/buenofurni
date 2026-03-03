import Hero from "@/components/sections/Hero";
import ColorVariants from "@/components/sections/ColorVariants";
import TrustBenefits from "@/components/sections/TrustBenefits";
import FeaturedModels from "@/components/sections/FeaturedModels";
import CustomSteps from "@/components/sections/CustomSteps";
import FinalCta from "@/components/sections/FinalCta";
import PageLayout from "@/components/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout headerVariant="overlay">
      <Hero />
      <ColorVariants />
      <TrustBenefits />
      <FeaturedModels />
      <CustomSteps />
      <FinalCta />
    </PageLayout>
  );
}
