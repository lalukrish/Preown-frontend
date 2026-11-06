"use client";

import React from "react";
import Image from "next/image";

import { CgAbstract } from "react-icons/cg";

const defaultTestimonials = [
  {
    id: 1,
    image: "/apple-lap.jpg",
    imageAlt: "Client testimonial",
    quote:
      "From the first consultation to the final reveal, the team truly brought our vision to life. The attention to detail was exceptional",
    name: "Modhu Sudon Dotto",
    role: "Homeowner, Modern Loft Project",
  },
  {
    id: 2,
    image: "/tech-girl.png",
    imageAlt: "Client testimonial",
    quote:
      "The entire process was smooth and professional. Every detail was thoughtfully considered, and the final result exceeded our expectations.",
    name: "Sarah Williams",
    role: "Homeowner, Riverside Residence",
  },
  {
    id: 3,
    image: "/tech-girl.png",
    imageAlt: "Client testimonial",
    quote:
      "They understood exactly what we wanted and transformed the space beautifully. We couldn't be happier with our new home.",
    name: "Daniel Martin",
    role: "Homeowner, Modern Villa Project",
  },
];

function TestimonialCard({ image, imageAlt, quote, name, role, hidden }) {
  return (
    // outer = slot (50cqw desktop, 100cqw mobile). inner padding = gap between cards
    <div className="tcard shrink-0 pr-6" aria-hidden={hidden || undefined}>
      <article className="flex h-[220px] overflow-hidden rounded-3xl bg-[#F9F0E3] sm:h-[240px]">
        {/* left: small image inside box */}
        <div className="relative h-full w-[36%] shrink-0 bg-[#E9DCC8]">
          <Image
            src={image}
            alt={hidden ? "" : (imageAlt ?? name)}
            fill
            sizes="(max-width: 767px) 36vw, 18vw"
            className="object-contain p-4 sm:p-5"
          />
        </div>

        {/* right: text */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-5 sm:px-6 sm:py-6">
          <p className="line-clamp-4 text-[clamp(0.9375rem,1.4vw,1.125rem)] font-normal leading-[1.3] tracking-[-0.02em] text-[#302d29]">
            "{quote}"
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-[1rem] font-semibold tracking-[-0.02em] text-[#302d29] sm:text-[1.125rem]">
                {name}
              </h3>
              <p className="mt-1 truncate text-[0.75rem] leading-[1.5] text-[#302d29]">
                {role}
              </p>
            </div>

            <div className="shrink-0 text-[#bdb6aa]" aria-hidden="true">
              <CgAbstract size={40} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function TestimonialsSection({
  subtitle = "TESTIMONIALS",
  title = "What Our Clients Love About Working With Us",
  description = `Lorem Ipsum is simply dummy text of the printing
    and typesetting industry. Lorem Ipsum is simply
    dummy text of the printing and typesetting industry.`,
  testimonials = defaultTestimonials,
  secondsPerCard = 8, // higher = slower
  className = "",
}) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      className={`w-full overflow-hidden bg-white ${className}`}
      aria-labelledby="testimonials-title"
    >
      <style>{`
        .tmarquee { container-type: inline-size; }
        .tcard { width: 100cqw; }
        @media (min-width: 768px) { .tcard { width: 50cqw; } }
        @keyframes testimonial-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ttrack { animation: testimonial-marquee linear infinite; }
        .tmarquee:hover .ttrack { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .ttrack { animation: none; } }
      `}</style>

      <div className="mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-16 xl:px-40 2xl:px-40 lg:py-20 xl:py-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16 sm:gap-4">
          {/* <div>
            <SubTitle text={subtitle} />

            <Title text={title} className="max-w-[650px]" />
          </div>

          <div className="lg:pt-10 sm:pt-0">
            <Descriptions description={description} />
          </div> */}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 2xl:mt-28">
          <div className="tmarquee overflow-hidden">
            <div
              className="ttrack flex w-max"
              style={{
                animationDuration: `${testimonials.length * secondsPerCard}s`,
              }}
            >
              {/* list twice so loop seamless */}
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={`${testimonial.id}-dup`}
                  {...testimonial}
                  hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
