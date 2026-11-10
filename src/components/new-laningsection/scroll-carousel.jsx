// "use client";

// import { useEffect, useRef, useState } from "react";

// // Images live in /public/carousel/*.jpg
// const ITEMS = [
//   {
//     id: "mac",
//     image: "/mac.jpg",
//     category: "Laptops",
//     date: "October 25, 2026",
//     title: "Powerful Performance. Sleek Design. Meet Your Next MacBook.",
//   },
//   {
//     id: "wired-headphone",
//     image: "/wired-headphone.webp",
//     category: "Audio & Accessories",
//     date: "October 27, 2026",
//     title: "Experience Every Beat with Premium Wired Headphones",
//   },
//   {
//     id: "apple-phone",
//     image: "/apple-phone.jpg",
//     category: "Smartphones",
//     date: "October 26, 2026",
//     title: "Discover Innovation and Performance with iPhone",
//   },
//   {
//     id: "headphone",
//     image: "/headphone.webp",
//     category: "Audio & Accessories",
//     date: "October 24, 2026",
//     title: "Immerse Yourself in Sound with Premium Headphones",
//   },
//   {
//     id: "s26",
//     image: "/s26.jpg",
//     category: "Smartphones",
//     date: "October 23, 2026",
//     title: "Explore Next-Level Innovation with Samsung Galaxy S26",
//   },
//   {
//     id: "apple-watch",
//     image: "/apple-watch.png",
//     category: "Wearables",
//     date: "October 22, 2026",
//     title: "Stay Connected and Stylish with Apple Watch",
//   },
// ];
// // Card size by distance from active: [active, odd distance, even distance]
// const W = [258, 154, 205];
// const H = [342, 205, 275];
// const GAP = 57;
// const STAGE_W = 1400;
// const STAGE_H = H[0];
// const INTERVAL_MS = 4000;
// const DURATION_MS = 700;

// const mod = (n, m) => ((n % m) + m) % m;
// const tier = (d) => {
//   const a = Math.abs(d);
//   return a === 0 ? 0 : a % 2 === 1 ? 1 : 2;
// };

// function centerX(d) {
//   if (d === 0) return 0;
//   const a = Math.abs(d);
//   let x = W[0] / 2 + GAP;
//   for (let k = 1; k < a; k++) x += W[tier(k)] + GAP;
//   x += W[tier(a)] / 2;
//   return Math.sign(d) * x;
// }

// export default function BcgCarousel() {
//   const [pos, setPos] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [reduceMotion, setReduceMotion] = useState(false);
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduceMotion(mq.matches);
//     const onChange = (e) => setReduceMotion(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);

//   useEffect(() => {
//     const el = wrapRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       setScale(Math.max(0.5, Math.min(1.3, entry.contentRect.width / STAGE_W)));
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   useEffect(() => {
//     if (paused || reduceMotion) return;
//     const t = setInterval(() => setPos((p) => p + 1), INTERVAL_MS);
//     return () => clearInterval(t);
//   }, [paused, reduceMotion]);

//   const slots = [];
//   for (let k = pos - 3; k <= pos + 3; k++) slots.push(k);

//   const ease = `${reduceMotion ? 0 : DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;

//   return (
//     <section className="w-full bg-black pb-10 pt-40 md:pt-20  text-center h-screen ">
//       <p className="font-sans pt-7 md:pt-7 xl:pt-10 translate-y-3 2xl:pt-20 text-[14px] font-bold uppercase tracking-wide text-white">
//         Welcome to Preown
//       </p>
//       <h2
//         className="mx-auto mt-4 translate-y-5 max-w-[560px] text-[32px] md:text-[46px] font-normal leading-[1.02] text-[#fff]"
//         // style={{
//         //   fontFamily: '"Source Serif 4", "Iowan Old Style", Georgia, serif',
//         // }}
//       >
//         Welcome To Preown World
//       </h2>

//       <div
//         ref={wrapRef}
//         className="relative mt-12 md:mt-20 w-full overflow-hidden "
//         style={{ height: STAGE_H * scale }}
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         <div
//           className="absolute left-1/2 top-0 "
//           style={{
//             width: STAGE_W,
//             height: STAGE_H,
//             marginLeft: -STAGE_W / 2,
//             transform: `scale(${scale})`,
//             transformOrigin: "top center",
//           }}
//         >
//           {slots.map((k) => {
//             const d = k - pos;
//             const t = tier(d);
//             const w = W[t];
//             const h = H[t];
//             const item = ITEMS[mod(k, ITEMS.length)];
//             const active = d === 0;

//             return (
//               <button
//                 key={k}
//                 type="button"
//                 aria-label={`${item.category}: ${item.title}`}
//                 aria-current={active}
//                 tabIndex={active ? 0 : -1}
//                 onClick={() => !active && setPos(k)}
//                 className="absolute block overflow-hidden  p-0 text-left "
//                 style={{
//                   left: STAGE_W / 2 + centerX(d) - w / 2,
//                   top: (STAGE_H - h) / 2,
//                   width: w,
//                   height: h,
//                   opacity: Math.abs(d) > 2 ? 0 : 1,
//                   pointerEvents: Math.abs(d) > 2 ? "none" : "auto",
//                   cursor: active ? "default" : "pointer",
//                   transition: `left ${ease}, top ${ease}, width ${ease}, height ${ease}, opacity ${ease}`,
//                 }}
//               >
//                 <img
//                   src={item.image}
//                   alt=""
//                   draggable={false}
//                   className="absolute inset-0 h-full w-full object-cover"
//                 />

//                 <div
//                   className="pointer-events-none absolute inset-0"
//                   style={{
//                     opacity: active ? 1 : 0,
//                     transition: `opacity ${active ? "400ms ease 300ms" : "200ms ease"}`,
//                   }}
//                 >
//                   <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full  bg-[#1b1f2a]/70 px-4 py-[5px] font-sans text-[14px] uppercase text-white backdrop-blur-sm">
//                     {item.category}
//                   </span>

//                   <div className="absolute inset-x-5 bottom-5 rounded-[22px] bg-[#ececec]/75 px-5 py-4 font-sans backdrop-blur-md">
//                     <p className="text-[11px] text-[#2b2f38]">
//                       <span className="mr-2 font-bold uppercase">Article</span>
//                       <span className="uppercase">{item.date}</span>
//                     </p>
//                     <p
//                       className="mt-2 text-[22px] font-light leading-[1.2] text-[#2b2f38]"
//                       style={{
//                         display: "-webkit-box",
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {item.title}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
// "use client";

// import { useEffect, useRef, useState } from "react";

// // Images live in /public/carousel/*.jpg
// const ITEMS = [
//   {
//     id: "mac",
//     image: "/mac.jpg",
//     category: "Laptops",
//     date: "October 25, 2026",
//     title: "Powerful Performance. Sleek Design. Meet Your Next MacBook.",
//   },
//   {
//     id: "wired-headphone",
//     image: "/wired-headphone.webp",
//     category: "Audio & Accessories",
//     date: "October 27, 2026",
//     title: "Experience Every Beat with Premium Wired Headphones",
//   },
//   {
//     id: "apple-phone",
//     image: "/apple-phone.jpg",
//     category: "Smartphones",
//     date: "October 26, 2026",
//     title: "Discover Innovation and Performance with iPhone",
//   },
//   {
//     id: "headphone",
//     image: "/headphone.webp",
//     category: "Audio & Accessories",
//     date: "October 24, 2026",
//     title: "Immerse Yourself in Sound with Premium Headphones",
//   },
//   {
//     id: "s26",
//     image: "/s26.jpg",
//     category: "Smartphones",
//     date: "October 23, 2026",
//     title: "Explore Next-Level Innovation with Samsung Galaxy S26",
//   },
//   {
//     id: "apple-watch",
//     image: "/apple-watch.png",
//     category: "Wearables",
//     date: "October 22, 2026",
//     title: "Stay Connected and Stylish with Apple Watch",
//   },
// ];

// // Card size by distance from active: [active, odd distance, even distance]
// const W = [258, 154, 205];
// const H = [302, 205, 275];
// const GAP = 57;
// const STAGE_W = 1400;
// const STAGE_H = H[0];
// const INTERVAL_MS = 4000;
// const DURATION_MS = 700;

// const mod = (n, m) => ((n % m) + m) % m;
// const tier = (d) => {
//   const a = Math.abs(d);
//   return a === 0 ? 0 : a % 2 === 1 ? 1 : 2;
// };

// function centerX(d) {
//   if (d === 0) return 0;
//   const a = Math.abs(d);
//   let x = W[0] / 2 + GAP;
//   for (let k = 1; k < a; k++) x += W[tier(k)] + GAP;
//   x += W[tier(a)] / 2;
//   return Math.sign(d) * x;
// }

// export default function BgCarousel() {
//   const [pos, setPos] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [reduceMotion, setReduceMotion] = useState(false);
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduceMotion(mq.matches);
//     const onChange = (e) => setReduceMotion(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);

//   useEffect(() => {
//     const el = wrapRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       setScale(Math.max(0.5, Math.min(1.3, entry.contentRect.width / STAGE_W)));
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   useEffect(() => {
//     if (paused || reduceMotion) return;
//     const t = setInterval(() => setPos((p) => p + 1), INTERVAL_MS);
//     return () => clearInterval(t);
//   }, [paused, reduceMotion]);

//   const slots = [];
//   for (let k = pos - 3; k <= pos + 3; k++) slots.push(k);

//   const ease = `${reduceMotion ? 0 : DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;

//   // Mobile: scale hits 0.5 floor, cards too short. Stretch height only.
//   // scale 0.5 -> scaleY 1.6 (taller). scale >= 1 -> scaleY 1.
//   const scaleY = scale >= 1 ? scale : 1 + (1 - scale) * 1.2;
//   const stageHeight = STAGE_H * scaleY;

//   return (
//     <section className="w-full bg-black pb-10 pt-40 md:pt-20  text-center h-screen ">
//       <p className="font-sans pt-7 md:pt-7 xl:pt-10 translate-y-3 2xl:pt-20 text-[14px] font-bold uppercase tracking-wide text-white">
//         Welcome to Preown
//       </p>
//       <h2 className="mx-auto mt-4 translate-y-5 max-w-[560px] text-[32px] md:text-[46px] font-normal leading-[1.02] text-[#fff]">
//         Welcome To Preown World
//       </h2>

//       <div
//         ref={wrapRef}
//         className="relative mt-12 md:mt-20 w-full overflow-hidden "
//         style={{ height: stageHeight }}
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         <div
//           className="absolute left-1/2 top-0 "
//           style={{
//             width: STAGE_W,
//             height: STAGE_H,
//             marginLeft: -STAGE_W / 2,
//             transform: `scale(${scale}, ${scaleY})`,
//             transformOrigin: "top center",
//           }}
//         >
//           {slots.map((k) => {
//             const d = k - pos;
//             const t = tier(d);
//             const w = W[t];
//             const h = H[t];
//             const item = ITEMS[mod(k, ITEMS.length)];
//             const active = d === 0;

//             return (
//               <button
//                 key={k}
//                 type="button"
//                 aria-label={`${item.category}: ${item.title}`}
//                 aria-current={active}
//                 tabIndex={active ? 0 : -1}
//                 onClick={() => !active && setPos(k)}
//                 className="absolute block overflow-hidden  p-0 text-left "
//                 style={{
//                   left: STAGE_W / 2 + centerX(d) - w / 2,
//                   top: (STAGE_H - h) / 2,
//                   width: w,
//                   height: h,
//                   opacity: Math.abs(d) > 2 ? 0 : 1,
//                   pointerEvents: Math.abs(d) > 2 ? "none" : "auto",
//                   cursor: active ? "default" : "pointer",
//                   transition: `left ${ease}, top ${ease}, width ${ease}, height ${ease}, opacity ${ease}`,
//                 }}
//               >
//                 <img
//                   src={item.image}
//                   alt=""
//                   draggable={false}
//                   className="absolute inset-0 h-full w-full object-cover"
//                 />

//                 <div
//                   className="pointer-events-none absolute inset-0"
//                   style={{
//                     opacity: active ? 1 : 0,
//                     transition: `opacity ${active ? "400ms ease 300ms" : "200ms ease"}`,
//                   }}
//                 >
//                   <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full  bg-[#1b1f2a]/70 px-4 py-[5px] font-sans text-[14px] uppercase text-white backdrop-blur-sm">
//                     {item.category}
//                   </span>

//                   <div className="absolute inset-x-5 bottom-5 rounded-[22px] bg-[#ececec]/75 px-5 py-4 font-sans backdrop-blur-md">
//                     <p className="text-[11px] text-[#2b2f38]">
//                       <span className="mr-2 font-bold uppercase">Article</span>
//                       <span className="uppercase">{item.date}</span>
//                     </p>
//                     <p
//                       className="mt-2 text-[22px] font-light leading-[1.2] text-[#2b2f38]"
//                       style={{
//                         display: "-webkit-box",
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {item.title}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";

// Images live in /public/carousel/*.jpg
const ITEMS = [
  {
    id: "mac",
    image: "/mac.jpg",
    category: "Laptops",
    date: "October 25, 2026",
    title: "Powerful Performance. Sleek Design. Meet Your Next MacBook.",
  },
  {
    id: "wired-headphone",
    image: "/wired-headphone.webp",
    category: "Audio & Accessories",
    date: "October 27, 2026",
    title: "Experience Every Beat with Premium Wired Headphones",
  },
  {
    id: "apple-phone",
    image: "/apple-phone.jpg",
    category: "Smartphones",
    date: "October 26, 2026",
    title: "Discover Innovation and Performance with iPhone",
  },
  {
    id: "headphone",
    image: "/headphone.webp",
    category: "Audio & Accessories",
    date: "October 24, 2026",
    title: "Immerse Yourself in Sound with Premium Headphones",
  },
  {
    id: "s26",
    image: "/s26.jpg",
    category: "Smartphones",
    date: "October 23, 2026",
    title: "Explore Next-Level Innovation with Samsung Galaxy S26",
  },
  {
    id: "apple-watch",
    image: "/apple-watch.png",
    category: "Wearables",
    date: "October 22, 2026",
    title: "Stay Connected and Stylish with Apple Watch",
  },
];

// Card size by distance from active: [active, odd distance, even distance]
const DESKTOP = { W: [258, 154, 205], H: [342, 205, 275], GAP: 57 };
// Mobile: active wider, neighbors narrower
const MOBILE = { W: [290, 90, 120], H: [380, 230, 300], GAP: 10 };
const STAGE_W = 1400;
const MOBILE_BP = 768;
const INTERVAL_MS = 4000;
const DURATION_MS = 700;

const mod = (n, m) => ((n % m) + m) % m;
const tier = (d) => {
  const a = Math.abs(d);
  return a === 0 ? 0 : a % 2 === 1 ? 1 : 2;
};

function centerX(d, W, GAP) {
  if (d === 0) return 0;
  const a = Math.abs(d);
  let x = W[0] / 2 + GAP;
  for (let k = 1; k < a; k++) x += W[tier(k)] + GAP;
  x += W[tier(a)] / 2;
  return Math.sign(d) * x;
}

export default function BcgCarousel() {
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cw, setCw] = useState(STAGE_W);
  const [reduceMotion, setReduceMotion] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCw(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setPos((p) => p + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  const isMobile = cw < MOBILE_BP;
  const { W, H, GAP } = isMobile ? MOBILE : DESKTOP;
  const stageW = isMobile ? cw : STAGE_W;
  const stageH = H[0];
  const scale = isMobile ? 1 : Math.max(0.5, Math.min(1.3, cw / STAGE_W));

  const slots = [];
  for (let k = pos - 3; k <= pos + 3; k++) slots.push(k);

  const ease = `${reduceMotion ? 0 : DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;

  return (
    <section className="w-full bg-black pb-10 pt-20 md:pt-20  text-center h-screen ">
      <p className="font-sans pt-7 md:pt-7 xl:pt-10 translate-y-3 2xl:pt-20 text-[14px] font-bold uppercase tracking-wide text-white">
        Welcome to Preown
      </p>
      <h2 className="mx-auto mt-4 translate-y-5 max-w-[560px] text-[32px] md:text-[46px] font-normal leading-[1.02] text-[#fff]">
        Welcome To Preown World
      </h2>

      <div
        ref={wrapRef}
        className="relative mt-12 md:mt-20 w-full overflow-hidden "
        style={{ height: stageH * scale }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute left-1/2 top-0 "
          style={{
            width: stageW,
            height: stageH,
            marginLeft: -stageW / 2,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {slots.map((k) => {
            const d = k - pos;
            const t = tier(d);
            const w = W[t];
            const h = H[t];
            const item = ITEMS[mod(k, ITEMS.length)];
            const active = d === 0;

            return (
              <button
                key={k}
                type="button"
                aria-label={`${item.category}: ${item.title}`}
                aria-current={active}
                tabIndex={active ? 0 : -1}
                onClick={() => !active && setPos(k)}
                className="absolute block overflow-hidden  p-0 text-left "
                style={{
                  left: stageW / 2 + centerX(d, W, GAP) - w / 2,
                  top: (stageH - h) / 2,
                  width: w,
                  height: h,
                  opacity: Math.abs(d) > 2 ? 0 : 1,
                  pointerEvents: Math.abs(d) > 2 ? "none" : "auto",
                  cursor: active ? "default" : "pointer",
                  transition: `left ${ease}, top ${ease}, width ${ease}, height ${ease}, opacity ${ease}`,
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: active ? 1 : 0,
                    transition: `opacity ${active ? "400ms ease 300ms" : "200ms ease"}`,
                  }}
                >
                  <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full  bg-[#1b1f2a]/70 px-4 py-[5px] font-sans text-[14px] uppercase text-white backdrop-blur-sm">
                    {item.category}
                  </span>

                  <div className="absolute inset-x-5 bottom-5 rounded-[22px] bg-[#ececec]/75 px-5 py-4 font-sans backdrop-blur-md">
                    <p className="text-[11px] text-[#2b2f38]">
                      <span className="mr-2 font-bold uppercase">Article</span>
                      <span className="uppercase">{item.date}</span>
                    </p>
                    <p
                      className="mt-2 text-[22px] font-light leading-[1.2] text-[#2b2f38]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
