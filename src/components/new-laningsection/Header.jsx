// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// // import { useHeaderContext } from "./HeaderContext";
// import { FaPhone, FaEnvelope } from "react-icons/fa";
// import logo from "@/assets/newlogo.png";

// import { IoMenu, IoClose, IoBagOutline } from "react-icons/io5";
// const navLinks = [
//   { label: "Shop", href: "/shop" },
//   { label: "About", href: "/about" },
//   // { label: "Services", href: "/services" },
//   // { label: "Vlog", href: "/vlogs" },
//   { label: "Blog", href: "/blogs" },
//   { label: "Contact", href: "/contact-us" },
// ];

// export default function Header() {
//   //   const { forceAtTop } = useHeaderContext();
//   const [scrollAtTop, setScrollAtTop] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     // if (forceAtTop !== undefined) return;

//     const checkPosition = () => setScrollAtTop(window.scrollY <= 0);
//     checkPosition();

//     window.addEventListener("scroll", checkPosition, { passive: true });
//     window.addEventListener("wheel", checkPosition, { passive: true });
//     window.addEventListener("touchmove", checkPosition, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", checkPosition);
//       window.removeEventListener("wheel", checkPosition);
//       window.removeEventListener("touchmove", checkPosition);
//     };
//   }, []);

//   useEffect(() => {
//     const html = document.documentElement;
//     html.style.overflow = menuOpen ? "hidden" : "";
//     return () => {
//       html.style.overflow = "";
//     };
//   }, [menuOpen]);

//   //   const atTop = forceAtTop !== undefined ? forceAtTop : scrollAtTop;
//   //   const textTone = atTop ? "text-black" : "text-white";

//   return (
//     <>
//       <header className="fixed left-0 top-0 w-full z-[9999] py-5 flex items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16 xl:px-20 2xl:px-40 bg-white border-b border-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out">
//         {/* LOGO */}
//         <Link href="/" className="flex items-center shrink-0">
//           <Image
//             src={logo}
//             alt="Preown"
//             width={140}
//             height={40}
//             className="h-10 w-auto object-contain"
//           />{" "}
//         </Link>

//         {/* NAV — md and up */}
//         <nav className="hidden md:flex items-center justify-end gap-5 lg:gap-8 xl:gap-10 flex-1 text-black">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="font-medium whitespace-nowrap transition-colors duration-500 text-sm lg:text-base xl:text-[18px] 2xl:text-lg text-black hover:text-[#E5C498]"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* CONTACT ICONS — md and up */}
//         {/* <div
//           className={`hidden md:flex items-center gap-4 lg:gap-6 xl:gap-6 2xl:gap-10 shrink-0 transition-colors duration-500 ${textTone}`}
//         >
//           <a
//             href="tel:+1234567890"
//             aria-label="Call us"
//             className="transition-colors hover:text-[#E5C498]"
//           >
//             <Phone
//               className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
//               strokeWidth={1}
//             />
//           </a>
//           <a
//             href="mailto:hello@zumaar.com"
//             aria-label="Email us"
//             className="transition-colors hover:text-[#E5C498]"
//           >
//             <Mail
//               className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
//               strokeWidth={1}
//             />
//           </a>
//         </div> */}

//         <div className="flex items-center gap-4 shrink-0">
//           {/* SHOP LINK — mobile only */}
//           <Link
//             href="/shop"
//             className="md:hidden flex items-center gap-2 text-base font-semibold text-black transition-colors hover:text-[#E5C498]"
//           >
//             <IoBagOutline className="h-6 w-6" />
//             Shop
//           </Link>

//           {/* HAMBURGER — all screens now */}
//           <button
//             type="button"
//             onClick={() => setMenuOpen(true)}
//             aria-label="Open menu"
//             aria-expanded={menuOpen}
//             className="shrink-0 transition-colors cursor-pointer duration-500 md:pl-8 text-black"
//           >
//             <IoMenu
//               className="h-7 w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
//               strokeWidth={1.5}
//             />
//           </button>
//         </div>
//       </header>

//       {/* MOBILE DRAWER */}
//       <div
//         className={`fixed inset-0 z-[9999] md:hidden ${
//           menuOpen ? "" : "pointer-events-none"
//         }`}
//       >
//         <div
//           className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
//             menuOpen ? "opacity-100" : "opacity-0"
//           }`}
//           onClick={() => setMenuOpen(false)}
//         />
//         <div
//           className={`absolute right-0 top-0 h-full w-[78%] max-w-xs bg-white border-l border-gray-200 px-6 py-6 transition-transform duration-500 ease-out ${
//             menuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="flex items-center justify-between">
//             <span className="text-black leading-[1.5] font-semibold tracking-[0.09em] text-xl">
//               Preown
//             </span>
//             <button
//               type="button"
//               onClick={() => setMenuOpen(false)}
//               aria-label="Close menu"
//               className="text-black"
//             >
//               <IoClose className="h-6 w-6" strokeWidth={1.5} />
//             </button>
//           </div>

//           {/* SHOP LINK — top */}
//           <Link
//             href="/shop"
//             onClick={() => setMenuOpen(false)}
//             className="mt-8 flex items-center gap-3 text-lg font-semibold text-black transition-colors hover:text-[#E5C498]"
//           >
//             <IoBagOutline className="h-6 w-6" />
//             Shop Now
//           </Link>

//           <nav className="mt-8 flex flex-col gap-6">
//             {navLinks.map((link, i) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setMenuOpen(false)}
//                 style={{
//                   transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
//                 }}
//                 className={`text-lg font-medium text-black hover:text-[#E5C498] transition-all duration-500 ease-out ${
//                   menuOpen
//                     ? "opacity-100 translate-x-0"
//                     : "opacity-0 translate-x-6"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           <div
//             style={{
//               transitionDelay: menuOpen
//                 ? `${150 + navLinks.length * 90}ms`
//                 : "0ms",
//             }}
//             className={`mt-10 flex items-center gap-6 text-black transition-all duration-500 ease-out ${
//               menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
//             }`}
//           >
//             <a
//               href="tel:+1234567890"
//               aria-label="Call us"
//               className="text-black hover:text-[#E5C498] transition-colors"
//             >
//               <FaPhone className="h-5 w-5" strokeWidth={1} />
//             </a>
//             <a
//               href="mailto:hello@zumaar.com"
//               aria-label="Email us"
//               className="text-black hover:text-[#E5C498] transition-colors"
//             >
//               <FaEnvelope className="h-5 w-5" strokeWidth={1} />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* DESKTOP DRAWER */}
//       <div
//         className={`fixed inset-0 z-[9999] hidden overflow-hidden md:block ${
//           menuOpen ? "" : "pointer-events-none"
//         }`}
//       >
//         <div
//           className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
//             menuOpen ? "opacity-100" : "opacity-0"
//           }`}
//           onClick={() => setMenuOpen(false)}
//         />
//         <div
//           className={`absolute right-0 top-0 h-full w-[45%] lg:w-[38%] xl:w-[30%] bg-white border-l border-gray-200 px-10 py-10 transition-transform duration-500 ease-out ${
//             menuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="flex items-center justify-between">
//             <span className="text-black leading-[1.5] font-semibold tracking-[0.09em] text-2xl">
//               Preown
//             </span>
//             <button
//               type="button"
//               onClick={() => setMenuOpen(false)}
//               aria-label="Close menu"
//               className="text-black"
//             >
//               <IoClose className="h-7 w-7 cursor-pointer" strokeWidth={1.5} />
//             </button>
//           </div>

//           {/* SHOP LINK — top */}
//           <Link
//             href="/shop"
//             onClick={() => setMenuOpen(false)}
//             className="mt-10 flex items-center gap-3 text-2xl xl:text-xl font-semibold text-black transition-colors hover:text-[#E5C498]"
//           >
//             <IoBagOutline className="h-7 w-7" />
//             Shop Now
//           </Link>

//           <nav className="mt-10 flex flex-col gap-8 text-black">
//             {navLinks.map((link, i) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setMenuOpen(false)}
//                 style={{
//                   transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
//                 }}
//                 className={`text-2xl xl:text-xl font-medium text-black hover:text-[#E5C498] transition-all duration-500 ease-out ${
//                   menuOpen
//                     ? "opacity-100 translate-x-0"
//                     : "opacity-0 translate-x-6"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           <div
//             style={{
//               transitionDelay: menuOpen
//                 ? `${150 + navLinks.length * 90}ms`
//                 : "0ms",
//             }}
//             className={`mt-14 flex items-center gap-8 text-black transition-all duration-500 ease-out ${
//               menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
//             }`}
//           >
//             <a
//               href="tel:+1234567890"
//               aria-label="Call us"
//               className="text-black hover:text-[#E5C498] transition-colors"
//             >
//               <FaPhone className="h-6 w-6" strokeWidth={1} />
//             </a>
//             <a
//               href="mailto:hello@zumaar.com"
//               aria-label="Email us"
//               className="text-black hover:text-[#E5C498] transition-colors"
//             >
//               <FaEnvelope className="h-6 w-6" strokeWidth={1} />
//             </a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useHeaderContext } from "./HeaderContext";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "@/assets/newlogo.png";

import { IoMenu, IoClose, IoBagOutline } from "react-icons/io5";
import OfferBar from "../Header/offerbar";
const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  // { label: "Services", href: "/services" },
  // { label: "Vlog", href: "/vlogs" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  //   const { forceAtTop } = useHeaderContext();
  const [scrollAtTop, setScrollAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [offerBarHeight, setOfferBarHeight] = useState(0);
  const offerBarRef = useRef(null);

  useEffect(() => {
    // if (forceAtTop !== undefined) return;

    const checkPosition = () => setScrollAtTop(window.scrollY <= 0);
    checkPosition();

    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("wheel", checkPosition, { passive: true });
    window.addEventListener("touchmove", checkPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("wheel", checkPosition);
      window.removeEventListener("touchmove", checkPosition);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      html.style.overflow = "";
    };
  }, [menuOpen]);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          `https://backapp.preown.store/api/top-header-tags`,
        );
        if (!res.ok) throw new Error("Failed to fetch offers");
        const result = await res.json();
        setOffers(result?.data || []);
      } catch (error) {
        console.error("Top offer API error:", error);
      }
    };
    fetchOffers();
  }, []);

  // Rotate offers
  useEffect(() => {
    if (offers.length <= 1 || closed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [offers.length, closed]);

  // Measure offer bar height
  useEffect(() => {
    const measure = () => {
      const h =
        closed || offers.length === 0
          ? 0
          : offerBarRef.current?.offsetHeight || 0;
      setOfferBarHeight(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [offers, currentIndex, closed]);

  //   const atTop = forceAtTop !== undefined ? forceAtTop : scrollAtTop;
  //   const textTone = atTop ? "text-black" : "text-white";

  return (
    <>
      <div className="fixed left-0 top-0 z-[9999] w-full">
        {/* OFFER BAR — above header */}
        {offers.length > 0 && (
          <OfferBar
            offers={offers}
            currentIndex={currentIndex}
            closed={closed}
            setClosed={setClosed}
            scrolled={false}
            offerBarHeight={offerBarHeight}
            offerBarRef={offerBarRef}
          />
        )}

        <header className="w-full py-5 flex items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16 xl:px-20 2xl:px-40 bg-white border-b border-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out">
          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={logo}
              alt="Preown"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
            />{" "}
          </Link>

          {/* NAV — md and up */}
          <nav className="hidden md:flex items-center justify-end gap-5 lg:gap-8 xl:gap-10 flex-1 text-black">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium whitespace-nowrap transition-colors duration-500 text-sm lg:text-base xl:text-[18px] 2xl:text-lg text-black hover:text-[#E5C498]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CONTACT ICONS — md and up */}
          {/* <div
            className={`hidden md:flex items-center gap-4 lg:gap-6 xl:gap-6 2xl:gap-10 shrink-0 transition-colors duration-500 ${textTone}`}
          >
            <a
              href="tel:+1234567890"
              aria-label="Call us"
              className="transition-colors hover:text-[#E5C498]"
            >
              <Phone
                className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
                strokeWidth={1}
              />
            </a>
            <a
              href="mailto:hello@zumaar.com"
              aria-label="Email us"
              className="transition-colors hover:text-[#E5C498]"
            >
              <Mail
                className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
                strokeWidth={1}
              />
            </a>
          </div> */}

          <div className="flex items-center gap-4 shrink-0">
            {/* SHOP LINK — mobile only */}
            <Link
              href="/shop"
              className="md:hidden flex items-center gap-2 text-base font-semibold text-black transition-colors hover:text-[#E5C498]"
            >
              <IoBagOutline className="h-6 w-6" />
              Shop
            </Link>

            {/* HAMBURGER — all screens now */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="shrink-0 transition-colors cursor-pointer duration-500 md:pl-8 text-black"
            >
              <IoMenu
                className="h-7 w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </header>
      </div>

      {/* Spacer — pushes page content down by offer bar height */}
      <div style={{ height: offerBarHeight }} />

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[10000] md:hidden ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[78%] max-w-xs bg-white border-l border-gray-200 px-6 py-6 transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-black leading-[1.5] font-semibold tracking-[0.09em] text-xl">
              Preown
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-black"
            >
              <IoClose className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* SHOP LINK — top */}
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center gap-3 text-lg font-semibold text-black transition-colors hover:text-[#E5C498]"
          >
            <IoBagOutline className="h-6 w-6" />
            Shop Now
          </Link>

          <nav className="mt-8 flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
                }}
                className={`text-lg font-medium text-black hover:text-[#E5C498] transition-all duration-500 ease-out ${
                  menuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              transitionDelay: menuOpen
                ? `${150 + navLinks.length * 90}ms`
                : "0ms",
            }}
            className={`mt-10 flex items-center gap-6 text-black transition-all duration-500 ease-out ${
              menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <a
              href="tel:+1234567890"
              aria-label="Call us"
              className="text-black hover:text-[#E5C498] transition-colors"
            >
              <FaPhone className="h-5 w-5" strokeWidth={1} />
            </a>
            <a
              href="mailto:hello@zumaar.com"
              aria-label="Email us"
              className="text-black hover:text-[#E5C498] transition-colors"
            >
              <FaEnvelope className="h-5 w-5" strokeWidth={1} />
            </a>
          </div>
        </div>
      </div>

      {/* DESKTOP DRAWER */}
      <div
        className={`fixed inset-0 z-[10000] hidden overflow-hidden md:block ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[45%] lg:w-[38%] xl:w-[30%] bg-white border-l border-gray-200 px-10 py-10 transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-black leading-[1.5] font-semibold tracking-[0.09em] text-2xl">
              Preown
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-black"
            >
              <IoClose className="h-7 w-7 cursor-pointer" strokeWidth={1.5} />
            </button>
          </div>

          {/* SHOP LINK — top */}
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="mt-10 flex items-center gap-3 text-2xl xl:text-xl font-semibold text-black transition-colors hover:text-[#E5C498]"
          >
            <IoBagOutline className="h-7 w-7" />
            Shop Now
          </Link>

          <nav className="mt-10 flex flex-col gap-8 text-black">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
                }}
                className={`text-2xl xl:text-xl font-medium text-black hover:text-[#E5C498] transition-all duration-500 ease-out ${
                  menuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              transitionDelay: menuOpen
                ? `${150 + navLinks.length * 90}ms`
                : "0ms",
            }}
            className={`mt-14 flex items-center gap-8 text-black transition-all duration-500 ease-out ${
              menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <a
              href="tel:+1234567890"
              aria-label="Call us"
              className="text-black hover:text-[#E5C498] transition-colors"
            >
              <FaPhone className="h-6 w-6" strokeWidth={1} />
            </a>
            <a
              href="mailto:hello@zumaar.com"
              aria-label="Email us"
              className="text-black hover:text-[#E5C498] transition-colors"
            >
              <FaEnvelope className="h-6 w-6" strokeWidth={1} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
