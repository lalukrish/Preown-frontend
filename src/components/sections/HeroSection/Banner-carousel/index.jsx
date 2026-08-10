"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * BannerCarousel — image-only banner carousel.
 *
 * Props:
 *  slides     {Array}   — [{ id, img, href }]
 *  height     {string}  — CSS height (default "30vh")
 *  autoPlayMs {number}  — interval in ms (default 4000, 0 = off)
 *  showDots   {boolean} — dot indicators (default true)
 *  showArrows {boolean} — prev/next arrows (default true)
 */

const DEFAULT_SLIDES = [
  { id: 1, img: "/banner1.jpg", href: "/products?category=smartphones" },
  { id: 2, img: "/banner2.jpg", href: "/products?category=laptops" },
  { id: 3, img: "/banner1.jpg", href: "https://wa.me/919995556734" },
];

export default function BannerCarousel({
  slides = DEFAULT_SLIDES,
  height = "30vh",
  autoPlayMs = 4000,
  showDots = true,
  showArrows = true,
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (index, dir = "next") => {
      if (isAnimating || index === current) return;
      setDirection(dir);
      setIsAnimating(true);
      setCurrent((index + count) % count);
      setTimeout(() => setIsAnimating(false), 450);
    },
    [current, count, isAnimating],
  );

  const next = useCallback(() => goTo(current + 1, "next"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "prev"), [current, goTo]);

  useEffect(() => {
    if (autoPlayMs <= 0 || isPaused) return;
    const t = setInterval(next, autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlayMs, isPaused, next]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div className="py-0 ">
      <section
        className="relative w-full overflow-hidden"
        style={{ height }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Promotional banners"
      >
        {slides.map((s, i) => {
          const isActive = i === current;
          const isPrev = i === (current - 1 + count) % count;
          let translateX = "100%";
          if (isActive) translateX = "0%";
          else if (isPrev) translateX = direction === "next" ? "-100%" : "100%";

          return (
            <div
              key={s.id}
              className="absolute inset-0 transition-transform duration-[450ms] ease-in-out"
              style={{
                transform: `translateX(${translateX})`,
                zIndex: isActive ? 1 : 0,
              }}
            >
              <Link href={s.href} className="block w-full h-full">
                <img
                  src={s.img}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </Link>
            </div>
          );
        })}

        {/* Arrows */}
        {/* {showArrows && count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/25 hover:bg-black/45 backdrop-blur-sm text-white rounded-full p-2 transition-all"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/25 hover:bg-black/45 backdrop-blur-sm text-white rounded-full p-2 transition-all"
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )} */}

        {/* Dots */}
        {showDots && count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    i === current ? "#f97316" : "rgba(255,255,255,0.6)",
                }}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {/* {autoPlayMs > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
          <div
            key={`${current}-${isPaused}`}
            className="h-full bg-cyan-950"
            style={{
              animation: isPaused
                ? "none"
                : `progressBar ${autoPlayMs}ms linear forwards`,
            }}
          />
        </div>
      )} */}

        <style jsx>{`
          @keyframes progressBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
