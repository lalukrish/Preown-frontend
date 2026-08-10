import Category from "@/components/sections/Category/Category";
import CustomerReviewsSection from "@/components/sections/CustomerReviewsSection/CustomerReviewsSection";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import IntroductionSection from "@/components/sections/IntroductionSection/IntroductionSection";
import PhoneSelectorSection from "@/components/sections/PhoneSelectorSection/PhoneSelectorSection";
import SellSection from "@/components/sections/SellSection/SellSection";
import OwnPreownedSection from "@/components/sections/OwnPreownedSection/OwnPreownedSection";
import TradeInSection from "@/components/sections/TradeInSection/TradeInSection";
import ValuePropositionSection from "@/components/sections/ValuePropositionSection/ValuePropositionSection";
import WhyBuySection from "@/components/sections/WhyBuySection/WhyBuySection";
import FeaturedSection from "@/components/sections/FeaturedSection/FeaturedSection";

import {
  fetchSEOData,
  generateMetadataFromSEO,
  getStructuredData,
} from "@/utils/seo";
import PremiumSection from "@/components/sections/HeroSection/premium-section";

export async function generateMetadata() {
  const seoData = await fetchSEOData("home");
  return generateMetadataFromSEO(
    seoData,
    "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
    "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
    "/",
  );
}

export default async function Home() {
  const seoData = await fetchSEOData("home");
  const structuredData = getStructuredData(seoData);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className="">
        <HeroSection />
        <PremiumSection />
        {/* <OwnPreownedSection /> */}

        {/* <PhoneSelectorSection /> */}
        <WhyBuySection />
        {/* <IntroductionSection /> */}
        {/* <OwnPreownedSection /> */}

        <TradeInSection />
        <SellSection />

        {/* <ValuePropositionSection /> */}
        <Category />
        <CustomerReviewsSection />
      </div>
    </>
  );
}
