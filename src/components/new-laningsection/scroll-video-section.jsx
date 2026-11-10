"use client";

import { useEffect, useRef, useState } from "react";

const log = (...a) => console.log("[ScrollVideo]", ...a);

// text placement. full class strings so Tailwind keeps them
const POSITIONS = {
  "top-left": "top-[14%] left-[6%] text-left md:left-[8%]",
  "top-right": "top-[14%] right-[6%] text-right md:right-[8%]",
  "bottom-left": "bottom-[14%] left-[6%] text-left md:left-[8%]",
  "bottom-right": "bottom-[14%] right-[6%] text-right md:right-[8%]",
  "center-left": "top-[40%] -translate-y-1/2 left-[6%] text-left md:left-[8%]",
  "center-right":
    "top-[40%] -translate-y-1/2 right-[6%] text-right md:right-[8%]",
};

const TEXT_CLASS = "text-3xl font-semibold leading-tight md:text-5xl";

// glow pulse + shimmer sweep. --glow = glow color
const CSS = `
@keyframes sv-glow {
  0%, 100% {
    text-shadow:
      0 0 10px color-mix(in srgb, var(--glow) 45%, transparent),
      0 0 28px color-mix(in srgb, var(--glow) 28%, transparent),
      0 0 60px color-mix(in srgb, var(--glow) 15%, transparent);
  }
  50% {
    text-shadow:
      0 0 14px color-mix(in srgb, var(--glow) 65%, transparent),
      0 0 38px color-mix(in srgb, var(--glow) 45%, transparent),
      0 0 80px color-mix(in srgb, var(--glow) 25%, transparent);
  }
}
@keyframes sv-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -100% 0; }
}
`;

/**
 * Props:
 *  src             HLS master playlist (.m3u8) OR plain video (.mp4)
 *  poster          first-frame image (optional)
 *  heightVh        section height. longer = slower scrub
 *  smoothing       0..1, higher = snappier follow
 *  logo            image shown until video ready (e.g. "/logo.png")
 *  textColor       default text color for all texts (default white)
 *  glowColor       default glow + shimmer color (default premium gold)
 *  glow            true/false, glow + shimmer on/off for all texts
 *  shimmerOpacity  0..1, moving light strength (default 0.35)
 *  texts           array. scroll split into equal parts, one text per part.
 *                  item = "string"  OR
 *                  { text, description, color, descriptionColor, glow, position }
 *                    description       small text under title (narrow width)
 *                    color             overrides textColor
 *                    descriptionColor  default = color at 80%
 *                    glow              glow color string, or false to turn off
 *                    position          top-left | top-right | bottom-left |
 *                                      bottom-right | center-left | center-right
 *                  no position = alternate center-left / center-right.
 *                  "" = blank part.
 */
export default function ScrollVideo({
  src = "/showcase/hls-2/hls-2/master.m3u8",
  poster,
  heightVh = 500,
  smoothing = 0.12,
  logo = "/logo.png",
  textColor = "#ffffff",
  glowColor = "#FFC83D",
  glow = true,
  shimmerOpacity = 0.35,
  texts = [],
}) {
  const [ready, setReady] = useState(false);
  const [activeText, setActiveText] = useState(0);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const target = useRef(0); // wanted time (s)
  const current = useRef(0); // eased time (s)

  // attach source: mp4 direct, else hls.js, native HLS as fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // plain mp4: no hls.js
    if (/\.mp4($|\?)/i.test(src)) {
      log("plain mp4, src:", src);
      video.src = src;
      video.load();
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

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
      <style>{CSS}</style>
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

        {/* scroll text: per-text color, glow, position, description */}
        {texts.map((item, i) => {
          const cfg = typeof item === "string" ? { text: item } : item || {};
          const text = cfg.text || "";
          const description = cfg.description || "";
          const color = cfg.color || textColor;
          const itemGlow = cfg.glow === undefined ? glow : cfg.glow;
          const glowOn = itemGlow !== false && itemGlow !== null;
          const glowCol = typeof itemGlow === "string" ? itemGlow : glowColor;
          const pos =
            POSITIONS[cfg.position] ||
            (i % 2 === 0
              ? POSITIONS["center-left"]
              : POSITIONS["center-right"]);
          const isRight = pos.includes("right-[6%]");
          const isActive = i === activeText && !!text;
          const hiddenX = isRight ? "translate-x-8" : "-translate-x-8";

          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className={`pointer-events-none absolute z-[5] max-w-[80%] transition-all duration-700 ease-out md:max-w-[40%] ${pos} ${
                isActive ? "translate-x-0 opacity-100" : `${hiddenX} opacity-0`
              }`}
            >
              <div className="relative">
                <p
                  className={TEXT_CLASS}
                  style={{
                    color,
                    "--glow": glowCol,
                    animation:
                      glowOn && isActive
                        ? "sv-glow 3.5s ease-in-out infinite"
                        : undefined,
                  }}
                >
                  {text}
                </p>

                {/* moving light over text, very low opacity */}
                {glowOn && (
                  <p
                    aria-hidden
                    className={`absolute inset-0 ${TEXT_CLASS}`}
                    style={{
                      "--glow": glowCol,
                      color: "transparent",
                      opacity: shimmerOpacity,
                      backgroundImage:
                        "linear-gradient(105deg, transparent 35%, var(--glow) 50%, transparent 65%)",
                      backgroundSize: "250% 100%",
                      backgroundRepeat: "no-repeat",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      animation: isActive
                        ? "sv-shimmer 3.2s linear infinite"
                        : undefined,
                    }}
                  >
                    {text}
                  </p>
                )}
              </div>

              {/* description: narrow, small, fades in after title */}
              {description && (
                <p
                  className={`mt-3 max-w-[20rem] text-sm leading-relaxed transition-all delay-200 duration-700 ease-out md:text-base ${
                    isRight ? "ml-auto" : ""
                  } ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                  style={{
                    color: cfg.descriptionColor || color,
                    opacity: isActive ? (cfg.descriptionColor ? 1 : 0.8) : 0,
                  }}
                >
                  {description}
                </p>
              )}
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
