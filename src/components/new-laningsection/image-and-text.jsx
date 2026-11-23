"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL = 4000; // ms between slides
const FADE = 1000; // ms crossfade

const defaultSections = [
  {
    eyebrowLight: "",
    eyebrowAccent: "The Best Iphone",
    accentGradient:
      "bg-[linear-gradient(90deg,#2DB5FF_0%,#8A6BFF_25%,#F23CFF_50%,#FF4F8B_75%,#FF3B5C_100%)]",
    titleReverse: false,
    title: "Fostering Innovation and Excellence",
    description:
      "At eGlu, our culture revolves around empowering the team to think big, innovate boldly, and bring ideas to life.",
    paragraphs: [],
    images: ["/showcase/graphics/fold.jpg"],
    bgColor: "to-[#E5FFE5]!",
    imageBg: "bg-white",
  },
  {
    eyebrowLight: "",
    eyebrowAccent: "The Find Gadget",
    accentGradient:
      "bg-[linear-gradient(135deg,#8E7CF0_20%,#4F2FC9_90%,#4F2FC9_100%)]",
    titleReverse: false,
    title: "Fostering Innovation and Excellence",
    description:
      "At eGlu, our culture revolves around empowering the team to think big, innovate boldly, and bring ideas to life.",
    paragraphs: [],
    images: [],
    bgColor: "to-[#F0E0F0]!",
    imageBg: "bg-[#F0E0F0]",
  },
];

function ImageSlider({ images, imageBg, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full ${imageBg} ${className}`}
    >
      <style>{`
        @keyframes culture-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes culture-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .culture-float { animation: culture-float 5s ease-in-out infinite; }
        .culture-glow { animation: culture-glow 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .culture-float, .culture-glow { animation: none; }
        }
      `}</style>

      {/* soft glow behind image */}
      <div
        aria-hidden="true"
        className="culture-glow pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2  bg-white blur-[80px]"
      />

      {images.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={image.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: `opacity ${FADE}ms ease-in-out` }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        );
      })}

      {images.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
          aria-label="Culture image slides"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className="min-h-11 min-w-11 cursor-pointer p-4"
            >
              <span
                className={`block h-[2px] w-7 transition-all duration-300 ${
                  index === activeIndex ? "bg-white" : "bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TextBlock({
  id,
  eyebrowLight,
  eyebrowAccent,
  accentGradient,
  titleReverse,
  title,
  description,
  paragraphs,
  bgColor,
  reverse,
  className = "",
}) {
  const accent = (
    <span className={`${accentGradient} bg-clip-text text-transparent`}>
      {eyebrowAccent}
    </span>
  );

  return (
    <div
      className={`flex items-center overflow-hidden bg-gradient-to-br from-[#f5f7ec] via-[#e6deeb] ${bgColor} px-5 py-10 sm:px-8 md:px-10 md:py-6 lg:px-16 xl:px-20 ${className}`}
    >
      <div
        className={`w-full max-w-xl ${
          reverse ? "sm:mr-20 2xl:mr-60" : "sm:ml-20 2xl:ml-60"
        }`}
      >
        <h2
          id={id}
          className="!text-[37px] leading-tight text-black sm:!text-[44px] 2xl:!text-[56px]"
        >
          {titleReverse ? (
            <>
              {accent} {eyebrowLight}
            </>
          ) : (
            <>
              {eyebrowLight} {accent}
            </>
          )}
        </h2>

        <h1 className="mt-4 max-w-[600px] !text-[clamp(1.05rem,4vw,1.1rem)] !text-black">
          {title}
        </h1>

        {/* <p className="mt-4 max-w-[600px] !text-black/80">{description}</p> */}

        {paragraphs.length > 0 && (
          <div className="mt-5 space-y-3">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[0.9375rem] !text-white/70 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImageAndTextSection({
  sections = defaultSections,
  className = "",
}) {
  const rows = sections
    .slice(0, 2)
    .map((section, index) => ({ ...defaultSections[index], ...section }));

  return (
    <div
      className={`grid w-full grid-cols-1 md:h-screen md:grid-rows-2 ${className}`}
    >
      {rows.map((row, index) => {
        // row 1: text left, image right. row 2: image left, text right
        const reverse = index === 1;
        const titleId = `culture-section-title-${index}`;

        if (!row.images.length) return null;

        return (
          <section
            key={index}
            className="grid w-full grid-cols-1 md:h-full md:min-h-0 md:grid-cols-2"
            aria-labelledby={titleId}
          >
            <TextBlock
              id={titleId}
              {...row}
              reverse={reverse}
              className={reverse ? "md:order-2" : "md:order-1"}
            />
            <ImageSlider
              images={row.images}
              imageBg={row.imageBg}
              className={reverse ? "md:order-1" : "md:order-2"}
            />
          </section>
        );
      })}
    </div>
  );
}
