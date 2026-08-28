"use client";

import React from "react";
import Link from "next/link";
import { IoCloseCircle } from "react-icons/io5";

export default function OfferBar({
  offers,
  currentIndex,
  closed,
  setClosed,
  scrolled,
  offerBarHeight,
  offerBarRef,
}) {
  if (closed || offers.length === 0) return null;

  const offer = offers[currentIndex];
  const content = (
    <span className="text-sm font-medium md:text-base">{offer.TagName}</span>
  );

  return (
    <div
      ref={offerBarRef}
      className="relative z-[9999] grid grid-cols-[1fr_auto_1fr] items-center bg-cyan-900 px-4 py-2 text-white min-h-[42px] transition-transform duration-300 ease-in-out"
      style={{
        transform: scrolled
          ? `translateY(-${offerBarHeight}px)`
          : "translateY(0)",
      }}
    >
      <div />
      <div className="text-center">
        {offer.RedirectionLink ? (
          <Link
            href={offer.RedirectionLink}
            className="transition-opacity hover:opacity-80"
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Close offer"
          className="rounded-full p-1 transition hover:bg-white/10 cursor-pointer"
        >
          <IoCloseCircle size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
