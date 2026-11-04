import ScrollVideo from "@/components/new-laningsection/scroll-video-section";
import BagCarousel from "@/components/new-laningsection/scroll-carousel";
import ImageAndTextSection from "@/components/new-laningsection/image-and-text";
import { electronicsSection } from "@/components/new-laningsection/e-data";
export default function Page() {
  return (
    <main>
      <BagCarousel />
      <ScrollVideo texts={["Build fast", "", "Ship clean", "Scale easy"]} />
      <ImageAndTextSection {...electronicsSection} />;
    </main>
  );
}
