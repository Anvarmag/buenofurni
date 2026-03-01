import Hero from "@/components/sections/Hero";
import ColorVariants from "@/components/sections/ColorVariants";
import TrustBenefits from "@/components/sections/TrustBenefits";
import FeaturedModels from "@/components/sections/FeaturedModels";
import CustomSteps from "@/components/sections/CustomSteps";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <ColorVariants />
      <TrustBenefits />
      <FeaturedModels />
      <CustomSteps />
      <FinalCta />
    </>
  );
}
