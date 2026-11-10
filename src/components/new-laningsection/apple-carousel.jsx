"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const GAP = 24; // px between cards, match gap-6

const defaultItems = [];

// same horizontal padding everywhere so heading, arrows, cards align
const SIDE_PAD = "px-5 sm:px-10 lg:px-40";

const mask = (v) => ({ maskImage: v, WebkitMaskImage: v });

// CSS-only graphics. each = list of absolute layers (style objects)
// fine film grain (SVG noise, no image file). kills gradient banding, adds premium feel
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// shared finish: glass sheen on top edge + grain
const FINISH = [
  {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 38%)",
  },
  {
    backgroundImage: GRAIN,
    backgroundSize: "180px 180px",
    opacity: 0.16,
    mixBlendMode: "overlay",
  },
];

// Apple-style mesh gradients: dark base + soft light blobs
const GRAPHICS = {
  // Apple blue + indigo
  blue: [
    {
      background: [
        "radial-gradient(60% 55% at 18% 12%, rgba(64,156,255,0.95), transparent 70%)",
        "radial-gradient(55% 55% at 88% 28%, rgba(94,92,230,0.9), transparent 70%)",
        "radial-gradient(70% 50% at 50% 100%, rgba(10,132,255,0.65), transparent 70%)",
        "radial-gradient(40% 40% at 8% 92%, rgba(191,90,242,0.4), transparent 70%)",
        "linear-gradient(160deg, #07123f, #0b0630)",
      ].join(", "),
    },
    ...FINISH,
  ],
  // pink + violet
  purple: [
    {
      background: [
        "radial-gradient(60% 55% at 12% 20%, rgba(255,55,95,0.8), transparent 70%)",
        "radial-gradient(60% 60% at 90% 15%, rgba(191,90,242,0.85), transparent 70%)",
        "radial-gradient(70% 50% at 70% 100%, rgba(94,92,230,0.7), transparent 70%)",
        "linear-gradient(160deg, #1a0630, #0d0218)",
      ].join(", "),
    },
    ...FINISH,
  ],
  // deep emerald + teal
  green: [
    {
      background: [
        "radial-gradient(60% 55% at 85% 10%, rgba(48,209,88,0.8), transparent 70%)",
        "radial-gradient(55% 55% at 10% 60%, rgba(100,210,255,0.35), transparent 70%)",
        "radial-gradient(70% 50% at 60% 100%, rgba(10,160,110,0.6), transparent 70%)",
        "linear-gradient(160deg, #03261c, #010f0a)",
      ].join(", "),
    },
    ...FINISH,
  ],
  // orange + red sunset
  sunset: [
    {
      background: [
        "radial-gradient(60% 55% at 15% 15%, rgba(255,159,10,0.9), transparent 70%)",
        "radial-gradient(55% 55% at 90% 35%, rgba(255,55,95,0.85), transparent 70%)",
        "radial-gradient(70% 50% at 40% 100%, rgba(191,90,242,0.5), transparent 70%)",
        "linear-gradient(160deg, #2a0a0f, #12030a)",
      ].join(", "),
    },
    ...FINISH,
  ],
  // space grey / titanium
  graphite: [
    {
      background: [
        "radial-gradient(60% 50% at 20% 10%, rgba(255,255,255,0.28), transparent 70%)",
        "radial-gradient(60% 60% at 95% 40%, rgba(142,142,147,0.35), transparent 70%)",
        "radial-gradient(70% 50% at 50% 100%, rgba(99,99,102,0.5), transparent 70%)",
        "linear-gradient(160deg, #2c2c2e, #0c0c0e)",
      ].join(", "),
    },
    ...FINISH,
  ],
};

// graphic can be preset name OR image path ("/graphics/x.png")
function GraphicBg({ graphic }) {
  const layers = GRAPHICS[graphic];

  if (!layers) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${graphic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return layers.map((style, i) => (
    <div
      key={i}
      aria-hidden="true"
      className="absolute inset-0"
      style={style}
    />
  ));
}

function CarouselCard({ image, title, description, graphic, useGraphic }) {
  // graphic on = item has graphic AND section flag on. else old white card
  const hasGraphic = useGraphic && !!graphic;

  return (
    <article
      data-card
      className={`relative flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl h-[450px] shadow-lg sm:w-[52vw] lg:w-[34vw] xl:w-[30vw] ${
        hasGraphic ? "bg-black" : "bg-white"
      }`}
    >
      {hasGraphic && <GraphicBg graphic={graphic} />}

      {/* soft dark fade at bottom, keeps text readable on any graphic */}
      {hasGraphic && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 to-transparent"
        />
      )}

      {/* image area: transparent PNG centered, not cropped */}
      <div className="relative min-h-0 flex-1 p-8 sm:p-10">
        <div className="relative h-full w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 639px) 78vw, (max-width: 1023px) 52vw, 34vw"
            className={`object-contain ${
              hasGraphic ? "drop-shadow-[0_14px_18px_rgba(0,0,0,0.45)]" : ""
            }`}
          />
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-6 sm:px-8 sm:pb-8">
        <h3
          className={`!text-[1.35rem] leading-tight sm:!text-[1.65rem] ${
            hasGraphic ? "!text-white" : "!text-[#161513]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-sm sm:text-base ${
            hasGraphic ? "!text-white/80" : "!text-[#161513]/70"
          }`}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
function ArrowButton({ direction, onClick, disabled }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous card" : "Next card"}
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-neutral-800 disabled:cursor-default disabled:opacity-30"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={isPrev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
/**
 * Props:
 *  items          [{ id, title, description, image: {src, alt}, graphic? }]
 *                 graphic = "blue" | "purple" | "green"  (CSS effect)
 *                           or image path e.g. "/graphics/x.png"
 *                 no graphic = white card
 *  graphics       true/false. false = all cards white, even with graphic set
 *  bgColor        top half bg class
 *  bottomBgColor  bottom half bg class
 */
export default function CardCarousel({
  items = defaultItems,
  graphics = true,
  bgColor = "bg-[#fff]", // top half
  bottomBgColor = "bg-gray-300", // bottom half
  className = "",
}) {
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, items.length]);

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = (card ? card.offsetWidth : 400) + GAP;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section
      className={`relative flex min-h-screen w-full flex-col overflow-hidden pb-10 pt-28 ${bgColor} ${className}`}
    >
      {/* light band behind lower part of cards */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-[45%] ${bottomBgColor}`}
      />

      {/* heading + arrows, one row */}
      <div
        className={`relative z-10 flex shrink-0 items-end justify-between gap-4 pb-8 ${SIDE_PAD}`}
      >
        <h1 className="text-4xl text-black sm:text-5xl lg:text-5xl mb-0">
          Choose Your Gadget Today
        </h1>
        <div className="flex shrink-0 gap-2 ">
          <ArrowButton
            direction="prev"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            class
          />
          <ArrowButton
            direction="next"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
          />
        </div>
      </div>

      {/* cards */}
      <div
        ref={scrollRef}
        className="relative z-10 pt-10 flex min-h-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-5 pl-5 pr-5 [scrollbar-width:none] sm:scroll-pl-10 sm:pl-10 sm:pr-10 lg:scroll-pl-40 lg:pl-40 lg:pr-40 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <CarouselCard key={item.id} useGraphic={graphics} {...item} />
        ))}
      </div>
    </section>
  );
}
