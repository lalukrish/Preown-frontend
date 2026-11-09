// "use client";

// import Image from "next/image";
// import { useCallback, useEffect, useRef, useState } from "react";

// const GAP = 24; // px between cards, match gap-6

// const defaultItems = [];

// function CarouselCard({ image, title, description }) {
//   return (
//     <article
//       data-card
//       className="flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl h-[450px] bg-white sm:w-[52vw] lg:w-[34vw] xl:w-[30vw]"
//     >
//       {/* image area: transparent PNG sits on white, centered, not cropped */}
//       <div className="relative min-h-0 flex-1 p-8 sm:p-10">
//         <div className="relative h-full w-full">
//           <Image
//             src={image.src}
//             alt={image.alt}
//             fill
//             sizes="(max-width: 639px) 78vw, (max-width: 1023px) 52vw, 34vw"
//             className="object-contain"
//           />
//         </div>
//       </div>

//       <div className="shrink-0 px-6 pb-6 sm:px-8 sm:pb-8">
//         <h3 className="!text-[1.35rem] leading-tight !text-[#161513] sm:!text-[1.65rem]">
//           {title}
//         </h3>
//         <p className="mt-2 text-sm !text-[#161513]/70 sm:text-base">
//           {description}
//         </p>
//       </div>
//     </article>
//   );
// }

// function ArrowButton({ direction, onClick, disabled }) {
//   const isPrev = direction === "prev";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       aria-label={isPrev ? "Previous card" : "Next card"}
//       className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-500/20 text-white transition hover:bg-gray-500/40 disabled:cursor-default disabled:opacity-30"
//     >
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         aria-hidden="true"
//       >
//         <path
//           d={isPrev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
//           stroke="currentColor"
//           strokeWidth="2.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </button>
//   );
// }

// export default function CardCarousel({
//   items = defaultItems,
//   bgColor = "bg-[#000]",
//   className = "",
// }) {
//   const scrollRef = useRef(null);
//   const [canPrev, setCanPrev] = useState(false);
//   const [canNext, setCanNext] = useState(true);

//   const updateButtons = useCallback(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanPrev(el.scrollLeft > 4);
//     setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
//   }, []);

//   useEffect(() => {
//     updateButtons();
//     const el = scrollRef.current;
//     if (!el) return;

//     el.addEventListener("scroll", updateButtons, { passive: true });
//     window.addEventListener("resize", updateButtons);

//     return () => {
//       el.removeEventListener("scroll", updateButtons);
//       window.removeEventListener("resize", updateButtons);
//     };
//   }, [updateButtons, items.length]);

//   const scrollByCard = (direction) => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const card = el.querySelector("[data-card]");
//     const step = (card ? card.offsetWidth : 400) + GAP;
//     el.scrollBy({ left: direction * step, behavior: "smooth" });
//   };

//   if (!items.length) return null;

//   return (
//     <section
//       className={`flex h-screen w-full flex-col pb-8 pt-20 sm:pb-10 ${bgColor} ${className}`}
//     >
//       <h1 className="text-white text-6xl pl-40 pt-32 xl:pt-10">
//         Choose Your Gadeget Today
//       </h1>
//       {/* arrows: top right, above cards */}
//       <div className="flex shrink-0 justify-end gap-2 px-5 pb-4 sm:px-10 lg:px-40 -translate-y-10">
//         <ArrowButton
//           direction="prev"
//           onClick={() => scrollByCard(-1)}
//           disabled={!canPrev}
//         />
//         <ArrowButton
//           direction="next"
//           onClick={() => scrollByCard(1)}
//           disabled={!canNext}
//         />
//       </div>

//       {/* cards fill remaining height */}
//       <div
//         ref={scrollRef}
//         className="flex min-h-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-5 pl-5 pr-5 [scrollbar-width:none] sm:scroll-pl-10 sm:pl-10 sm:pr-10 lg:scroll-pl-40 lg:pl-40 lg:pr-40 [&::-webkit-scrollbar]:hidden"
//       >
//         {items.map((item) => (
//           <CarouselCard key={item.id} {...item} />
//         ))}
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const GAP = 24; // px between cards, match gap-6

const defaultItems = [];

// same horizontal padding everywhere so heading, arrows, cards align
const SIDE_PAD = "px-5 sm:px-10 lg:px-40";

function CarouselCard({ image, title, description }) {
  return (
    <article
      data-card
      className="flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl h-[450px] bg-white shadow-lg sm:w-[52vw] lg:w-[34vw] xl:w-[30vw]"
    >
      {/* image area: transparent PNG sits on white, centered, not cropped */}
      <div className="relative min-h-0 flex-1 p-8 sm:p-10">
        <div className="relative h-full w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 639px) 78vw, (max-width: 1023px) 52vw, 34vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="shrink-0 px-6 pb-6 sm:px-8 sm:pb-8">
        <h3 className="!text-[1.35rem] leading-tight !text-[#161513] sm:!text-[1.65rem]">
          {title}
        </h3>
        <p className="mt-2 text-sm !text-[#161513]/70 sm:text-base">
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
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-500/30 text-white transition hover:bg-gray-500/50 disabled:cursor-default disabled:opacity-30"
    >
      <svg
        width="16"
        height="16"
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

export default function CardCarousel({
  items = defaultItems,
  bgColor = "bg-black", // top half
  bottomBgColor = "bg-[#f5f5f7]", // bottom half
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
      className={`relative flex min-h-screen w-full flex-col overflow-hidden pb-10 pt-20 ${bgColor} ${className}`}
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
        <h1 className="text-4xl text-white sm:text-5xl lg:text-6xl">
          Choose Your Gadget Today
        </h1>
        <div className="flex shrink-0 gap-2">
          <ArrowButton
            direction="prev"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
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
        className="relative z-10 flex min-h-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-5 pl-5 pr-5 [scrollbar-width:none] sm:scroll-pl-10 sm:pl-10 sm:pr-10 lg:scroll-pl-40 lg:pl-40 lg:pr-40 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <CarouselCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
