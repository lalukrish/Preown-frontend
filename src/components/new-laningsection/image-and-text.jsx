"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL = 4000; // ms between slides
const FADE = 1000; // ms crossfade
const ZOOM = 5500; // ms slow zoom per slide

export default function ImageAndTextSection({
  eyebrowLight = "The",
  eyebrowAccent = "eGlu Culture",
  titleReverse = false,
  title = "Fostering Innovation and Excellence",
  description = "At eGlu, our culture revolves around empowering the team to think big, innovate boldly, and bring ideas to life.",
  paragraphs = [],
  images = [],
  bgColor = "bg-[#161513]",
  reverse = false,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // lets first slide zoom too (scale changes after first paint)

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const accent = (
    <span className="bg-[linear-gradient(135deg,#E5C498_0%,#936542_90%,#936542_100%)] bg-clip-text text-transparent">
      {eyebrowAccent}
    </span>
  );

  return (
    <section
      className={`grid min-h-screen w-full grid-cols-1 md:grid-cols-2 ${className}`}
      aria-labelledby="culture-section-title"
    >
      <div
        className={`flex items-center ${bgColor} px-5 py-14 sm:px-8 sm:py-16 md:px-10 lg:px-16 xl:px-20 ${
          reverse ? "md:order-2" : "md:order-1"
        }`}
      >
        <div
          className={`w-full max-w-xl ${
            reverse ? "sm:mr-20 2xl:mr-60" : "sm:ml-20 2xl:ml-60"
          }`}
        >
          <h2
            id="culture-section-title"
            className="!text-[42px] leading-[1.05] text-white sm:!text-[60px] 2xl:!text-[68px]"
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

          <h1 className="mt-6 max-w-[600px] !text-[clamp(1.15rem,5vw,2.1rem)] !text-white">
            {title}
          </h1>

          <p className="mt-6 max-w-[600px] !text-white/80">{description}</p>

          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[0.9375rem] !text-white/70 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-full ${
          reverse ? "md:order-1" : "md:order-2"
        }`}
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          const zoomed = mounted && isActive;

          return (
            <div
              key={image.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 will-change-transform ${
                isActive ? "opacity-100" : "opacity-0"
              } ${zoomed ? "scale-110" : "scale-100"}`}
              style={{
                // active: fade in + slow zoom. inactive: fade out, then reset zoom after fade ends
                transition: isActive
                  ? `opacity ${FADE}ms ease-in-out, transform ${ZOOM}ms ease-out`
                  : `opacity ${FADE}ms ease-in-out, transform 0ms ${FADE}ms`,
              }}
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
            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
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
                    index === activeIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
