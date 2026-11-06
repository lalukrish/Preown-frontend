"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FullImageSection({
  image,
  imageAlt = "Interior design",

  title = "Unlock Your Dream Home Today!",
  titleDescription = "",

  description = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply.`,

  primaryButtonText = "More About",
  primaryButtonHref = "#",

  secondaryButtonText = "Call Us : +91 80808080",
  secondaryButtonHref = "tel:+9180808080",
  noRightSide = false,
  showBottomOverlay = false,

  className = "",
}) {
  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    if (!section || !imageWrap) return;

    let ticking = false;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const speed = 0.35;
      const offset = rect.top * speed;
      imageWrap.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={` sm:py-6 relative w-full overflow-hidden ${className}`}
      aria-labelledby="hero-title"
    >
      <div className="relative sm:min-h-[60vh] md:h-[100svh] lg:h-[100svh] xl:h-[100svh] min-h-[100svh] w-full">
        <div
          ref={imageWrapRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: "-15%", bottom: "-15%" }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 83vw" // 2. Optimizes download size
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div
            className="mx-auto grid grid-cols-1 items-end gap-6 px-5 pb-7 sm:px-8 sm:pb-10 lg:grid-cols-[1.2fr_0.8fr]
                    lg:gap-10 lg:px-20 lg:pb-12 xl:gap-16 xl:pb-40 2xl:pb-60  xl:px-60 2xl:px-80"
          >
            <div className="relative">
              {showBottomOverlay && (
                <div
                  className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8 bg-gradient-to-t from-black/70 via-black/35 to-transparent -z-10 rounded-xl"
                  aria-hidden="true"
                />
              )}
              <h1
                id="hero-title"
                className="max-w-[650px] text-[clamp(2.25rem,5vw,4.5rem)] 2xl:text-[clamp(3.25rem,6vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white"
              >
                {title}
              </h1>

              {titleDescription && <p>{titleDescription}</p>}
            </div>

            {!noRightSide && (
              <div className="flex max-w-[480px] flex-col items-start lg:ml-auto">
                ...
                {/* <Descriptions
                  description={description}
                  className="max-w-[450px] text-white "
                /> */}
                <div className="mt-10 md:mt-8 flex flex-wrap items-center md:gap-5 gap-3">
                  {/* <Button
                    href="/about"
                    label="More About"
                    variant="filled"
                    className="mt-0"
                  />

                  <Button
                    href="tel:+9180808080"
                    label="Call Us : +91 80808080"
                    variant="light-outlined"
                    className="mt-4 md:mt-0"
                  /> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
