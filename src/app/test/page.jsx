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
      <ScrollVideo texts={["Build fast", "", "Ship clean", "Scale easy"]} />
      <ImageAndTextSection
        sections={[
          { title: "Row one title", description: "...", images: imagesA },
          { title: "Row two title", description: "...", images: imagesB },
        ]}
      />{" "}
      <CardCarousel
        items={[
          {
            id: "c1",
            image: { src: "/apple-lap.jpg", alt: "Team brainstorming" },
            title: "Think big",
            description:
              "We back bold ideas and give people room to build them.",
          },
          {
            id: "c2",
            image: { src: "/apple-phone.jpg", alt: "Office event" },
            title: "Grow together",
            description: "Learning, mentoring, shipping side by side.",
          },
          {
            id: "c3",
            image: { src: "/apple-lap.jpg", alt: "Team brainstorming" },
            title: "Think big",
            description:
              "We back bold ideas and give people room to build them.",
          },
        ]}
      />
      <FullImageSection image="/tech-girl.png" />
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
    </main>
  );
}
