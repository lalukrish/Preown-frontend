"use client";
import Link from "next/link";
import { useState } from "react";
import logo from "@/assets/newlogo.png";

const footerLinks = [
  {
    heading: "Products",
    links: [
      "Smartphones",
      "Laptops",
      "Tablets",
      "Wearables",
      "Audio",
      "Accessories",
    ],
  },
  {
    heading: "Company",
    links: ["About Us", "Blog", "Careers", "Press"],
  },
  {
    heading: "Support",
    links: ["Contact Us", "FAQ", "Shipping Policy", "Return Policy"],
  },
  {
    heading: "Shop",
    links: ["All Products", "New Arrivals", "Best Sellers", "Deals"],
  },
  {
    heading: "Follow Us",
    links: ["Instagram", "Facebook", "YouTube", "Twitter"],
  },
  {
    heading: "Notices",
    links: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
  },
];

export default function FooterNew() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleJoin = () => {
    if (!name.trim() || !email.trim()) return;
    // wire to your API
    console.log({ name, email });
  };

  return (
    <footer className=" text-white bg-purple-100 ">
      <div className="px-10 py-10  ">
        <div className="bg-[#111111] rounded-4xl px-10">
          <div className="max-w-screen-xl mx-auto px-6  py-14 space-y-12 ">
            {/* Logo */}
            {/* <div className="flex flex-col items-start gap-1">
              <img
                src={logo.src}
                alt="PreOwn"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
              <p className="text-sm text-gray-400 mt-1">
                A <span className="text-orange-500 font-semibold">Trusted</span>{" "}
                Company
              </p>
            </div> */}
            <div className="flex flex-col items-center gap-1 -space-y-10!">
              <h1 className="text-[150px] font-semibold  text-white">
                Preown.
              </h1>

              <p className="mt-1 text-2xl text-gray-400">
                A <span className="font-semibold text-orange-500">Trusted</span>{" "}
                Company
              </p>
            </div>

            {/* Newsletter row */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-t border-white/10 pt-8">
              <p className="text-sm font-semibold text-white whitespace-nowrap min-w-[160px]">
                Sign up for
                <br />
                PreOwn updates!
              </p>

              <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* JOIN US button */}
              <button
                onClick={handleJoin}
                className="flex items-center gap-0 flex-shrink-0 rounded-full overflow-hidden border border-white/20"
              >
                <span className="px-5 py-3 text-sm font-bold text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors whitespace-nowrap">
                  JOIN US
                </span>
                <span className="px-4 py-3 bg-white flex items-center justify-center">
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                    <circle cx="4" cy="6" r="2" fill="#e74c3c" />
                    <circle cx="10" cy="6" r="2" fill="#e74c3c" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 border-t border-white/10 pt-8">
              {footerLinks.map((col) => (
                <div key={col.heading}>
                  <h4 className="text-sm font-bold text-orange-500 mb-3 tracking-wide">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="#"
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} PreOwn. All rights reserved.</p>
              <p>Certified Preowned Electronics — Kerala, India</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
