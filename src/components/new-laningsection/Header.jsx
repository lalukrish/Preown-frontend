"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useHeaderContext } from "./HeaderContext";
import { FaPhone, FaEnvelope } from "react-icons/fa";

import { IoMenu, IoClose } from "react-icons/io5";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Vlog", href: "/vlogs" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  //   const { forceAtTop } = useHeaderContext();
  const [scrollAtTop, setScrollAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // useEffect(() => {
  //   // document.body.style.overflow = menuOpen ? "hidden" : "";
  //   // return () => {
  //   //   document.body.style.overflow = "";
  //   // };
  //   if (menuOpen) {
  //     document.body.style.overflow = "hidden";
  //   }
  // }, [menuOpen]);
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      html.style.overflow = "";
    };
  }, [menuOpen]);

  //   const atTop = forceAtTop !== undefined ? forceAtTop : scrollAtTop;
  //   const textTone = atTop ? "text-black" : "text-white";

  return (
    <>
      <header
        className={`fixed left-0 w-full z-[9999] pt-5 flex items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16 xl:px-10 2xl:px-40 transition-all duration-700 ease-out 
            ${""}
        `}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0">
          <h2 className="pt-0 text-2xl text-white">Preown</h2>
        </Link>

        {/* NAV — md and up */}
        <nav className="hidden md:flex items-center justify-end gap-5 lg:gap-8 xl:gap-10 flex-1 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium whitespace-nowrap transition-colors duration-500 text-sm lg:text-base xl:text-[18px] 2xl:text-lg  text-white
               hover:text-[#E5C498]
              }`}
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

        {/* HAMBURGER — all screens now */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`shrink-0 transition-colors cursor-pointer duration-500 pl-8 text-white `}
        >
          <IoMenu
            className="h-7 w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-7 2xl:w-7"
            strokeWidth={1.5}
          />
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden ${
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
          className={`absolute right-0 top-0 h-full w-[78%] max-w-xs bg-black/90 border-l border-white/10 px-6 py-6  transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="bg-gradient-to-t from-[#E5C498] via-[#aa824e] to-[#936542] bg-clip-text text-transparent leading-[1.5] font-semibold tracking-[0.09em] text-xl">
              Preown
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-white"
            >
              <IoClose className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-6 ">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
                }}
                className={`text-lg font-medium text-white hover:text-[#E5C498] transition-all duration-500 ease-out ${
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
            className={`mt-10 flex items-center gap-6   text-white transition-all duration-500 ease-out ${
              menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <a
              href="tel:+1234567890"
              aria-label="Call us"
              className="hover:text-white transition-colors"
            >
              <FaPhone className="h-5 w-5" strokeWidth={1} />
            </a>
            <a
              href="mailto:hello@zumaar.com"
              aria-label="Email us"
              className="hover:text-white transition-colors"
            >
              <FaEnvelope className="h-5 w-5" strokeWidth={1} />
            </a>
          </div>
        </div>
      </div>

      {/* DESKTOP DRAWER */}
      <div
        className={`fixed inset-0 z-[9999] hidden overflow-hidden md:block ${
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
          className={`absolute right-0 top-0 h-full w-[45%] lg:w-[38%] xl:w-[50%] backdrop-blur-lg backdrop-saturate-100 bg-black/70 border-l border-white/10 px-10 py-10 transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="bg-gradient-to-t from-[#E5C498] via-[#aa824e] to-[#936542] bg-clip-text text-transparent leading-[1.5] font-semibold tracking-[0.09em] text-2xl">
              ZUMAAR
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-white"
            >
              <IoClose className="h-7 w-7 cursor-pointer" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mt-14 flex flex-col gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${150 + i * 90}ms` : "0ms",
                }}
                className={`text-2xl xl:text-lg font-medium text-white/50 hover:text-[#E5C498] transition-all duration-500 ease-out ${
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
            className={`mt-14 flex items-center gap-8 text-white/80 transition-all duration-500 ease-out ${
              menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <a
              href="tel:+1234567890"
              aria-label="Call us"
              className="hover:text-white transition-colors"
            >
              <FaPhone className="h-6 w-6" strokeWidth={1} />
            </a>
            <a
              href="mailto:hello@zumaar.com"
              aria-label="Email us"
              className="hover:text-white transition-colors"
            >
              <FaEnvelope className="h-6 w-6" strokeWidth={1} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
