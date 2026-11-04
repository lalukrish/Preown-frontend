// "use client";

// import { useEffect, useRef, useState } from "react";

// const log = (...a) => console.log("[ScrollVideo]", ...a);

// /**
//  * Props:
//  *  src         HLS master playlist
//  *  poster      first-frame image (optional)
//  *  heightVh    section height. longer = slower scrub
//  *  smoothing   0..1, higher = snappier follow
//  *  logo        image shown until video ready (e.g. "/logo.png")
//  */
// export default function ScrollVideo({
//   src = "/showcase/hls-1/master.m3u8",
//   poster,
//   heightVh = 500,
//   smoothing = 0.12,
//   logo = "/logo.png",
// }) {
//   const [ready, setReady] = useState(false);
//   const sectionRef = useRef(null);
//   const videoRef = useRef(null);
//   const target = useRef(0); // wanted time (s)
//   const current = useRef(0); // eased time (s)

//   // attach HLS: prefer hls.js, native only as fallback
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     let hls = null;
//     let cancelled = false;

//     log("loading hls.js...");
//     import("hls.js").then(({ default: Hls }) => {
//       if (cancelled) return;

//       if (Hls.isSupported()) {
//         log("using hls.js, src:", src);
//         hls = new Hls({
//           // buffer whole clip so scrub = seek in memory, no refetch
//           maxBufferLength: 60,
//           maxMaxBufferLength: 60,
//           maxBufferSize: 200 * 1000 * 1000,
//           backBufferLength: Infinity,
//           startLevel: -1,
//         });
//         hls.on(Hls.Events.MEDIA_ATTACHED, () => log("media attached"));
//         hls.on(Hls.Events.MANIFEST_LOADED, () => log("manifest loaded"));
//         hls.on(Hls.Events.MANIFEST_PARSED, (_, d) =>
//           log("manifest parsed, levels:", d.levels.length),
//         );
//         hls.on(Hls.Events.FRAG_LOADED, (_, d) =>
//           log("segment loaded:", d.frag.sn, "/", d.frag.level),
//         );
//         hls.on(Hls.Events.ERROR, (_, d) =>
//           console.error(
//             "[ScrollVideo] HLS error:",
//             d.type,
//             d.details,
//             d.fatal ? "(FATAL)" : "",
//             d.response ? "http " + d.response.code : "",
//           ),
//         );
//         hls.loadSource(src);
//         hls.attachMedia(video);
//       } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//         log("hls.js unsupported, using native HLS, src:", src);
//         video.src = src;
//       } else {
//         console.error("[ScrollVideo] no HLS support in this browser");
//       }
//     });

//     return () => {
//       cancelled = true;
//       if (hls) hls.destroy();
//     };
//   }, [src]);

//   // scroll progress -> target time
//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     let raf = 0;
//     const update = () => {
//       raf = 0;
//       const v = videoRef.current;
//       if (!v || !Number.isFinite(v.duration)) return;
//       const rect = section.getBoundingClientRect();
//       const total = rect.height - window.innerHeight;
//       const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
//       target.current = p * v.duration;
//     };
//     const onScroll = () => {
//       if (!raf) raf = requestAnimationFrame(update);
//     };

//     update();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (raf) cancelAnimationFrame(raf);
//     };
//   }, []);

//   // ease video time toward scroll target
//   useEffect(() => {
//     let raf = 0;
//     const tick = () => {
//       const v = videoRef.current;
//       if (v && Number.isFinite(v.duration)) {
//         current.current += (target.current - current.current) * smoothing;
//         if (Math.abs(target.current - current.current) < 0.001) {
//           current.current = target.current;
//         }
//         if (Math.abs(v.currentTime - current.current) > 0.01) {
//           v.currentTime = current.current;
//         }
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [smoothing]);

//   return (
//     <section
//       ref={sectionRef}
//       className="relative bg-black"
//       style={{ height: `${heightVh}vh` }}
//     >
//       <div className="sticky top-0 h-screen w-full overflow-hidden">
//         <video
//           ref={videoRef}
//           poster={poster}
//           muted
//           playsInline
//           preload="auto"
//           disablePictureInPicture
//           onLoadStart={() => log("video: loadstart")}
//           onLoadedMetadata={(e) =>
//             log("video: metadata, duration:", e.currentTarget.duration)
//           }
//           onLoadedData={() => {
//             log("video: loadeddata -> READY");
//             setReady(true);
//           }}
//           onCanPlay={() => log("video: canplay")}
//           onProgress={(e) => {
//             const v = e.currentTarget;
//             if (v.buffered.length)
//               log(
//                 "video: buffered",
//                 v.buffered.end(v.buffered.length - 1).toFixed(1) + "s /",
//                 v.duration && v.duration.toFixed(1) + "s",
//               );
//           }}
//           onError={(e) =>
//             console.error("[ScrollVideo] video error:", e.currentTarget.error)
//           }
//           className="h-full w-full object-cover"
//         />

//         {/* logo loader: show until video ready, then fade out */}
//         <div
//           className={`absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-700 ${
//             ready ? "pointer-events-none opacity-0" : "opacity-100"
//           }`}
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={logo}
//             alt=""
//             className="h-16 w-auto animate-pulse"
//             onError={(e) => {
//               e.currentTarget.style.display = "none";
//             }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";

const log = (...a) => console.log("[ScrollVideo]", ...a);

/**
 * Props:
 *  src         HLS master playlist
 *  poster      first-frame image (optional)
 *  heightVh    section height. longer = slower scrub
 *  smoothing   0..1, higher = snappier follow
 *  logo        image shown until video ready (e.g. "/logo.png")
 *  texts       array of strings. scroll split into equal parts, one text per part.
 *              alternate left / right. "" = blank part.
 *              e.g. ["Hello", "", "World"]
 */
export default function ScrollVideo({
  src = "/showcase/hls-1/master.m3u8",
  poster,
  heightVh = 500,
  smoothing = 0.12,
  logo = "/logo.png",
  texts = [],
}) {
  const [ready, setReady] = useState(false);
  const [activeText, setActiveText] = useState(0);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const target = useRef(0); // wanted time (s)
  const current = useRef(0); // eased time (s)

  // attach HLS: prefer hls.js, native only as fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls = null;
    let cancelled = false;

    log("loading hls.js...");
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;

      if (Hls.isSupported()) {
        log("using hls.js, src:", src);
        hls = new Hls({
          // buffer whole clip so scrub = seek in memory, no refetch
          maxBufferLength: 60,
          maxMaxBufferLength: 60,
          maxBufferSize: 200 * 1000 * 1000,
          backBufferLength: Infinity,
          startLevel: -1,
        });
        hls.on(Hls.Events.MEDIA_ATTACHED, () => log("media attached"));
        hls.on(Hls.Events.MANIFEST_LOADED, () => log("manifest loaded"));
        hls.on(Hls.Events.MANIFEST_PARSED, (_, d) =>
          log("manifest parsed, levels:", d.levels.length),
        );
        hls.on(Hls.Events.FRAG_LOADED, (_, d) =>
          log("segment loaded:", d.frag.sn, "/", d.frag.level),
        );
        hls.on(Hls.Events.ERROR, (_, d) =>
          console.error(
            "[ScrollVideo] HLS error:",
            d.type,
            d.details,
            d.fatal ? "(FATAL)" : "",
            d.response ? "http " + d.response.code : "",
          ),
        );
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        log("hls.js unsupported, using native HLS, src:", src);
        video.src = src;
      } else {
        console.error("[ScrollVideo] no HLS support in this browser");
      }
    });

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, [src]);

  // scroll progress -> target time + active text
  const textCount = texts.length;
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      if (textCount > 0) {
        setActiveText(Math.min(textCount - 1, Math.floor(p * textCount)));
      }

      const v = videoRef.current;
      if (!v || !Number.isFinite(v.duration)) return;
      target.current = p * v.duration;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [textCount]);

  // ease video time toward scroll target
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && Number.isFinite(v.duration)) {
        current.current += (target.current - current.current) * smoothing;
        if (Math.abs(target.current - current.current) < 0.001) {
          current.current = target.current;
        }
        if (Math.abs(v.currentTime - current.current) > 0.01) {
          v.currentTime = current.current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [smoothing]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadStart={() => log("video: loadstart")}
          onLoadedMetadata={(e) =>
            log("video: metadata, duration:", e.currentTarget.duration)
          }
          onLoadedData={() => {
            log("video: loadeddata -> READY");
            setReady(true);
          }}
          onCanPlay={() => log("video: canplay")}
          onProgress={(e) => {
            const v = e.currentTarget;
            if (v.buffered.length)
              log(
                "video: buffered",
                v.buffered.end(v.buffered.length - 1).toFixed(1) + "s /",
                v.duration && v.duration.toFixed(1) + "s",
              );
          }}
          onError={(e) =>
            console.error("[ScrollVideo] video error:", e.currentTarget.error)
          }
          className="h-full w-full object-cover"
        />

        {/* scroll text: alternate left / right, a bit above center */}
        {texts.map((text, i) => {
          const isLeft = i % 2 === 0;
          const isActive = i === activeText && !!text;
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className={`pointer-events-none absolute top-[40%] z-[5] max-w-[80%] -translate-y-1/2 transition-all duration-700 ease-out md:max-w-[40%] ${
                isLeft
                  ? "left-[6%] text-left md:left-[8%]"
                  : "right-[6%] text-right md:right-[8%]"
              } ${
                isActive
                  ? "translate-x-0 opacity-100"
                  : isLeft
                    ? "-translate-x-8 opacity-0"
                    : "translate-x-8 opacity-0"
              }`}
            >
              <p className="text-3xl font-semibold leading-tight text-white drop-shadow-lg md:text-5xl">
                {text}
              </p>
            </div>
          );
        })}

        {/* logo loader: show until video ready, then fade out */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt=""
            className="h-16 w-auto animate-pulse"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
}
