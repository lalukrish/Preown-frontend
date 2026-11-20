// "use client";

// import { useEffect, useRef, useState } from "react";

// const DEFAULT_SLIDES = [
//   {
//     title: "Seamless Home Extension",
//     desc: "Designed for a seamless connection, the eGlu App empowers effortless control whether you're at home or away",
//     image: "/showcase/apple-image.jpg",
//   },
//   {
//     title: "One App, Total Control",
//     desc: "Simplicity and advanced control; brings together every aspect of your smart home into one intuitive platform",
//     image: "/showcase/apple-watch.jpg",
//   },
//   {
//     title: "Smart is Personal",
//     desc: "The eGlu app allows for deep personalisation like never before to reflect your unique style",
//     image: "/showcase/applepencil.jpg",
//   },
//   {
//     title: "Voice-Driven Control",
//     desc: "Enjoy hands-free convenience and seamless voice integration with Amazon Alexa and Google Assistant",
//     image: "/showcase/fold.jpg",
//   },
// ];

// const TEXT_MS = 900;
// const IMAGE_MS = 1100; // image slower than text = parallax feel
// const EASE = "cubic-bezier(0.65, 0, 0.25, 1)";
// const SCROLL_VH_PER_SLIDE = 100; // scroll length per slide
// const HEADER_VH = 5; // header cover at top; pinned box = 100 - HEADER_VH

// export default function ScrollSplitSlider({ slides = DEFAULT_SLIDES }) {
//   const [index, setIndex] = useState(0);
//   const outerRef = useRef(null);
//   const innerRef = useRef(null);
//   const rafRef = useRef(0);
//   const count = slides.length;

//   useEffect(() => {
//     const update = () => {
//       rafRef.current = 0;
//       const outer = outerRef.current;
//       const inner = innerRef.current;
//       if (!outer || !inner) return;

//       const total = outer.offsetHeight - inner.offsetHeight;
//       if (total <= 0) return;

//       const scrolled =
//         -outer.getBoundingClientRect().top +
//         (window.innerHeight * HEADER_VH) / 100;
//       const progress = Math.min(1, Math.max(0, scrolled / total));
//       const next = Math.min(count - 1, Math.floor(progress * count));
//       setIndex((prev) => (prev === next ? prev : next));
//     };

//     const onScroll = () => {
//       if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
//     };

//     update();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [count]);

//   return (
//     <section
//       ref={outerRef}
//       className="relative w-full"
//       style={{ height: `${count * SCROLL_VH_PER_SLIDE}vh` }}
//     >
//       <div
//         ref={innerRef}
//         className="sticky flex w-full overflow-hidden bg-[#0a1316]"
//         style={{
//           top: `${HEADER_VH}vh`,
//           height: `${100 - HEADER_VH}vh`,
//         }}
//       >
//         {/* LEFT: text. clip window, track slides left, new text enters from right */}
//         <div className="relative h-full w-1/2 bg-gradient-to-br from-[#0f1e22] via-[#0e2026] to-[#010c11]">
//           <div className="absolute inset-y-0 left-0 right-[17%] overflow-hidden">
//             <div
//               className="flex h-full"
//               style={{
//                 transform: `translateX(-${index * 100}%)`,
//                 transition: `transform ${TEXT_MS}ms ${EASE}`,
//               }}
//             >
//               {slides.map((s, i) => {
//                 const active = i === index;
//                 return (
//                   <div
//                     key={s.title}
//                     className="flex h-full w-full shrink-0 flex-col justify-center pl-[36%] pr-4"
//                     style={{
//                       opacity: active ? 1 : 0,
//                       filter: active ? "blur(0px)" : "blur(6px)",
//                       transition: `opacity ${TEXT_MS}ms ${EASE}, filter ${TEXT_MS}ms ${EASE}`,
//                     }}
//                   >
//                     <div className="mb-4 flex h-7 w-7 items-center justify-center rounded-md bg-white/90">
//                       <span className="h-3 w-3 rounded-sm bg-[#0a1316]" />
//                     </div>
//                     <h2 className="mb-4 text-3xl font-medium leading-tight text-white md:text-4xl">
//                       {s.title}
//                     </h2>
//                     <p className="max-w-sm text-sm leading-relaxed text-white/70">
//                       {s.desc}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: images. track slides left, next image enters from right */}
//         <div className="relative h-full w-1/2 overflow-hidden">
//           <div
//             className="flex h-full"
//             style={{
//               transform: `translateX(-${index * 100}%)`,
//               transition: `transform ${IMAGE_MS}ms ${EASE}`,
//             }}
//           >
//             {slides.map((s) => (
//               <div key={s.image} className="h-full w-full shrink-0">
//                 <img
//                   src={s.image}
//                   alt={s.title}
//                   className="h-full w-full object-cover"
//                   draggable={false}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* chat button */}
//         <button
//           type="button"
//           aria-label="Chat"
//           className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#b9a27c] text-[#0a1316]"
//         >
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
//           </svg>
//         </button>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_SLIDES = [
  {
    title: "Seamless Home Extension",
    desc: "Designed for a seamless connection, the eGlu App empowers effortless control whether you're at home or away",
    image: "/showcase/apple-image.jpg",
  },
  {
    title: "One App, Total Control",
    desc: "Simplicity and advanced control; brings together every aspect of your smart home into one intuitive platform",
    image: "/showcase/apple-watch.jpg",
  },
  {
    title: "Smart is Personal",
    desc: "The eGlu app allows for deep personalisation like never before to reflect your unique style",
    image: "/showcase/applepencil.jpg",
  },
  {
    title: "Voice-Driven Control",
    desc: "Enjoy hands-free convenience and seamless voice integration with Amazon Alexa and Google Assistant",
    image: "/showcase/fold.jpg",
  },
];

const TEXT_MS = 900;
const IMAGE_MS = 1100; // image slower than text = parallax feel
const EASE = "cubic-bezier(0.65, 0, 0.25, 1)";
const SCROLL_VH_PER_SLIDE = 100; // scroll length per slide
const HEADER_VH = 5; // header cover at top; pinned box = 100 - HEADER_VH

export default function ScrollSplitSlider({ slides = DEFAULT_SLIDES }) {
  const [index, setIndex] = useState(0);
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(0);
  const count = slides.length;

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const total = outer.offsetHeight - inner.offsetHeight;
      if (total <= 0) return;

      const scrolled =
        -outer.getBoundingClientRect().top +
        (window.innerHeight * HEADER_VH) / 100;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      const next = Math.min(count - 1, Math.floor(progress * count));
      setIndex((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  return (
    <section
      ref={outerRef}
      className="relative w-full"
      style={{ height: `${count * SCROLL_VH_PER_SLIDE}vh` }}
    >
      <div
        ref={innerRef}
        className="sticky flex w-full flex-col overflow-hidden bg-[#0a1316] md:flex-row"
        style={{
          top: `${HEADER_VH}vh`,
          height: `${100 - HEADER_VH}vh`,
        }}
      >
        {/* TEXT: top on mobile, left on desktop */}
        <div className="relative h-1/2 w-full bg-gradient-to-br from-[#0f1e22] via-[#0e2026] to-[#010c11] md:h-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 right-0 overflow-hidden md:right-[17%]">
            <div
              className="flex h-full"
              style={{
                transform: `translateX(-${index * 100}%)`,
                transition: `transform ${TEXT_MS}ms ${EASE}`,
              }}
            >
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <div
                    key={s.title}
                    className="flex h-full w-full shrink-0 flex-col justify-center px-6 md:pl-[36%] md:pr-4"
                    style={{
                      opacity: active ? 1 : 0,
                      filter: active ? "blur(0px)" : "blur(6px)",
                      transition: `opacity ${TEXT_MS}ms ${EASE}, filter ${TEXT_MS}ms ${EASE}`,
                    }}
                  >
                    <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 md:mb-4">
                      <span className="h-3 w-3 rounded-sm bg-[#0a1316]" />
                    </div>
                    <h2 className="mb-2 text-2xl font-medium leading-tight text-white md:mb-4 md:text-4xl">
                      {s.title}
                    </h2>
                    <p className="max-w-sm text-sm leading-relaxed text-white/70">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* IMAGES: bottom on mobile, right on desktop */}
        <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: `transform ${IMAGE_MS}ms ${EASE}`,
            }}
          >
            {slides.map((s) => (
              <div key={s.image} className="h-full w-full shrink-0">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* chat button */}
        <button
          type="button"
          aria-label="Chat"
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#b9a27c] text-[#0a1316]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
