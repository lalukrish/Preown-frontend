// import Category from "@/components/sections/Category/Category";
// import CustomerReviewsSection from "@/components/sections/CustomerReviewsSection/CustomerReviewsSection";
// import HeroSection from "@/components/sections/HeroSection/HeroSection";
// import IntroductionSection from "@/components/sections/IntroductionSection/IntroductionSection";
// import PhoneSelectorSection from "@/components/sections/PhoneSelectorSection/PhoneSelectorSection";
// import SellSection from "@/components/sections/SellSection/SellSection";
// import OwnPreownedSection from "@/components/sections/OwnPreownedSection/OwnPreownedSection";
// import TradeInSection from "@/components/sections/TradeInSection/TradeInSection";
// import ValuePropositionSection from "@/components/sections/ValuePropositionSection/ValuePropositionSection";
// import WhyBuySection from "@/components/sections/WhyBuySection/WhyBuySection";
// import FeaturedSection from "@/components/sections/FeaturedSection/FeaturedSection";

// import {
//   fetchSEOData,
//   generateMetadataFromSEO,
//   getStructuredData,
// } from "@/utils/seo";
// import PremiumSection from "@/components/sections/HeroSection/premium-section";
// import Header from "@/components/new-laningsection/Header";

// export async function generateMetadata() {
//   const seoData = await fetchSEOData("home");
//   return generateMetadataFromSEO(
//     seoData,
//     "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
//     "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
//     "/",
//   );
// }

// export default async function Home() {
//   const seoData = await fetchSEOData("home");
//   const structuredData = getStructuredData(seoData);

//   return (
//     <>
//       {structuredData && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />
//       )}
//       <div className="">
//         <HeroSection />
//         <PremiumSection />
//         {/* <OwnPreownedSection /> */}

//         {/* <PhoneSelectorSection /> */}
//         <WhyBuySection />
//         {/* <IntroductionSection /> */}
//         {/* <OwnPreownedSection /> */}

//         <TradeInSection />
//         <SellSection />

//         {/* <ValuePropositionSection /> */}
//         <Category />
//         <CustomerReviewsSection />
//       </div>
//     </>
//   );
// }
import ScrollVideo from "@/components/new-laningsection/scroll-video-section";
import BagCarousel from "@/components/new-laningsection/scroll-carousel";
import ImageAndTextSection from "@/components/new-laningsection/image-and-text";
import { electronicsSection } from "@/components/new-laningsection/e-data";
import CardCarousel from "@/components/new-laningsection/apple-carousel";
import FullImageSection from "@/components/new-laningsection/fullImageScreen";
import TestimonialsSection from "@/components/new-laningsection/testimonia";
import Header from "@/components/new-laningsection/Header";
export default function Page() {
  const imagesA = [
    { id: "a1", src: "/apple-lap.jpg", alt: "Team brainstorming" },
    { id: "a2", src: "/apple-phone.jpg", alt: "Office event" },
    { id: "a3", src: "/images/culture-3.jpg", alt: "Team lunch" },
  ];

  const imagesB = [
    { id: "b1", src: "/apple-lap.jpg", alt: "Workshop session" },
    { id: "b2", src: "/apple-phone.jpg", alt: "Team celebration" },
  ];
  return (
    <main>
      <Header />
      <BagCarousel />
      <ScrollVideo
        src="/showcase/hls-2/hls-2/master.m3u8"
        heightVh={500}
        textColor="#ffffff"
        glowColor="#FFC83D"
        shimmerOpacity={0.3}
        texts={[
          {
            text: "Heart rate",
            position: "top-left",
            description:
              "Tracks every beat with sensor accuracy built for daily life.",
          },
          "",
          {
            text: "Most accurate",
            description:
              "Tracks every beat with sensor accuracy built for daily life.",

            color: "#fff",
            glow: "#FFB800",
            position: "bottom-right",
          },
          {
            text: "Enjoy Your music",
            description: "Clear readings, even during intense workouts.",

            color: "#000",
            glow: "#FFB800",
            position: "bottom-center",
          },
        ]}
      />
      <ImageAndTextSection
        sections={[
          {
            title:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            description: "simply dummy text of the ",
            images: imagesA,
          },
          {
            title:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            description: "simply dummy text of the ",
            images: imagesB,
          },
        ]}
      />{" "}
      <CardCarousel
        graphics={true}
        items={[
          {
            id: 1,
            title: "MacBook",

            description: "Like new.",
            image: { src: "/mac-nobg.png", alt: "Team brainstorming" },
            graphic: "blue",
          },
          {
            id: 2,
            title: "iPhone 18 pro max",

            description: "Fast and light.",
            image: { src: "/iphone18pro-nobg.png", alt: "Team brainstorming" },
            graphic: "purple",
          },
          {
            id: 3,
            title: "Watch",
            description: "Track everything.",
            image: { src: "/apple-watch.png", alt: "Watch" },
            graphic: "green",
          },
          {
            id: 4,
            title: "AirPods",
            description: "Clean sound.",
            image: { src: "/pods.png", alt: "AirPods" },
          },
        ]}
      />
      <TestimonialsSection
        subtitle="TESTIMONIALS"
        title="What Our Clients Love About Working With Us"
        description="We believe great design begins with understanding our clients. Here's what they have to say about working with us."
        interval={2000}
        testimonials={[
          {
            id: 1,
            image: "/apple-lap.jpg",
            imageAlt: "Client",
            quote:
              "From the first consultation to the final reveal, the team truly brought our vision to life. The attention to detail was exceptional.",
            name: "Modhu Sudon Dotto",
            role: "Homeowner, Modern Loft Project",
          },
          {
            id: 2,
            image: "/tech-girl.png",
            imageAlt: "Client",
            quote:
              "The team understood our requirements perfectly and created a space that feels completely ours.",
            name: "Sarah Williams",
            role: "Homeowner, Riverside Residence",
          },
          {
            id: 3,
            image: "/end-cover-2.jpg",
            imageAlt: "Client",
            quote:
              "Professional from beginning to end. The finished design was even better than we imagined.",
            name: "Daniel Martin",
            role: "Homeowner, Modern Villa Project",
          },
        ]}
      />
      <FullImageSection image="/gadgets.jpg" />
    </main>
  );
}
