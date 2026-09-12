"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/assets/newlogo.png";
import { usePathname } from "next/navigation";
import { DASHBOARD_ROUTES } from "@/utils/config";
import { FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// static columns — every link now points somewhere real instead of "#"
const STATIC_FOOTER_LINKS = [
  {
    heading: "Company",
    center: true,
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  // {
  //   heading: "Support",
  //   links: [
  //     { label: "Contact Us", href: "/about#contact" },
  //     { label: "FAQ", href: "/faq" },
  //     { label: "Shipping Policy", href: "/shipping-policy" },
  //     { label: "Return Policy", href: "/return-policy" },
  //   ],
  // },
  // {
  //   heading: "Shop",
  //   links: [
  //     { label: "All Products", href: "/products" },
  //     { label: "New Arrivals", href: "/products?sort=new" },
  //     { label: "Best Sellers", href: "/products?sort=bestseller" },
  //     { label: "Deals", href: "/products?deals=true" },
  //   ],
  // },
  {
    heading: "Follow Us",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/i_applebae/",
        external: true,
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/marketplace/profile/100004581601128/?ref=permalink&tab=listings&mibextid=6ojiHh",
        external: true,
      },
      // { label: "YouTube", href: "https://youtube.com/@preown", external: true },
      // { label: "Twitter", href: "https://twitter.com/preown", external: true },
      {
        label: "WhatsApp",
        href: "https://chat.whatsapp.com/EYnQKnUhFQhL8VdB9pQNIs?mode=ac_t",
        external: true,
        //  icon: FaWhatsapp,
      },
      {
        label: "Location",
        // TODO: swap in your real store location URL
        href: "https://www.google.com/search?sca_esv=4ab2dcfe03ad0fc5&sxsrf=AE3TifMph-RMJsgaw2YYM9lNtgLHpEvokQ%3A1752747649610&kgmid=%2Fg%2F11lf7cpk3s&q=Phonebae&shndl=30&shem=lcuae%2Clsptb2%2Csdl1p%2Cuaasie&source=sh%2Fx%2Floc%2Funi%2Fm1%2F1&kgs=56d75edf9abdf1c5",
        external: true,
        //  icon: FiMapPin,
      },
    ],
  },
  {
    heading: "Notices",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-and-conditions" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

// fallback categories if the API call fails or returns nothing — same
// slugs used by the header's category nav, so links stay consistent
const FALLBACK_CATEGORIES = [
  { label: "Smartphones", slug: "smartphones" },
  { label: "Laptops", slug: "laptops" },
  { label: "Tablets", slug: "tablets" },
  { label: "Wearables", slug: "wearables" },
  { label: "Audio", slug: "audio" },
  { label: "Accessories", slug: "accessories" },
];

export default function FooterNew() {
  const pathname = usePathname(); // ← add
  if (DASHBOARD_ROUTES.some((r) => pathname?.startsWith(r))) return null; // ← add

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productLinks, setProductLinks] = useState(
    FALLBACK_CATEGORIES.map((c) => ({
      label: c.label,
      href: `/products?category=${c.slug}`,
    })),
  );

  // confirmed shape — same endpoint + fields OwnPreownedSection uses:
  // cat.name, cat.documentId, category filter keyed off documentId
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?populate=*`,
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const json = await res.json();
        const raw = json.data || [];
        if (raw.length === 0) return; // keep fallback

        const normalized = raw
          .filter((c) => c.name && c.documentId)
          .map((c) => ({
            label: c.name,
            href: `/products?category=${c.documentId}`,
          }));

        if (normalized.length > 0) setProductLinks(normalized);
      } catch (err) {
        console.error("fetchCategories error:", err);
        // fallback categories stay in place
      }
    };

    fetchCategories();
  }, []);

  const handleJoin = () => {
    if (!name.trim() || !email.trim()) return;
    // wire to your API
    console.log({ name, email });
  };

  const footerLinks = [
    { heading: "Products", links: productLinks },
    ...STATIC_FOOTER_LINKS,
  ];

  return (
    <footer className=" text-white bg-cyan-50 ">
      <div className="px-2 md:px-10 py-6 md:py-10  ">
        <div className="bg-[#111111] rounded-4xl px-4 md:px-10">
          <div className="page-wrapper   mx-auto md:px-6 px-2   py-8 md:py-14 space-y-4 md:space-y-12 ">
            <div className="flex flex-col items-center gap-1 -space-y-10!">
              <h1 className="text-[60px] md:text-[150px]  font-semibold  text-white">
                Preown.
              </h1>

              <p className=" mt-5 md:mt-1  text-xl md:text-2xl text-gray-400">
                A <span className="font-semibold text-cyan-600">Trusted</span>{" "}
                Company
              </p>
            </div>

            {/* Link columns — flex + justify-center, not grid, so it centers
                as a group regardless of how many columns are active (grid-cols-6
                left 2 empty tracks once Support/Shop got commented out, which
                skewed everything left) */}
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 border-t border-white/10 pt-8">
              {footerLinks.map((col) => (
                <div
                  key={col.heading}
                  className={`min-w-[160px] ${col.center ? "text-center" : ""}`}
                >
                  <h4 className="text-base font-bold text-cyan-600 mb-3 tracking-wide">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ${
                              col.center ? "justify-center" : ""
                            }`}
                          >
                            {link.icon && <link.icon size={14} />}
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className={`flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ${
                              col.center ? "justify-center" : ""
                            }`}
                          >
                            {link.icon && <link.icon size={14} />}
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} PreOwn. All rights reserved.</p>
              <Link href="/terms-and-conditions">Terms and Conditions</Link>

              <p>Certified Preowned Electronics — Kerala, India</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
