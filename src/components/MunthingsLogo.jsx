// MunthingsLogo Component:
// Renders the official Munthings circular badge with a golden-yellow circle,
// a white crescent moon, the "MunThings" wordmark, and "by Barth's Studio" subtitle.

import React from 'react';

export const MunthingsLogo = ({
  className = '',
  size = 48,
  showSubtitle = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Visual Badge matching the uploaded logo */}
      <div
        className="relative rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105 duration-200"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          backgroundColor: '#F5A623',
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Golden Yellow Circle background */}
          <circle cx="80" cy="80" r="76" fill="#F5A623" />

          {/* White Crescent Moon outline */}
          <path
            d="M 68 22 C 86 38 88 74 72 104 C 58 126 92 136 120 120 C 76 142 34 116 46 80 C 54 54 62 34 68 22 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* MunThings wordmark inside badge */}
          <g>
            <text
              x="80"
              y="92"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Fredoka', 'Plus Jakarta Sans', sans-serif"
              fontWeight="700"
              fontSize="23"
              letterSpacing="-0.5"
            >
              MunThings
            </text>
            <text
              x="80"
              y="108"
              textAnchor="middle"
              fill="#0F766E"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="700"
              fontSize="9"
              letterSpacing="0.2"
            >
              by Barth&apos;s Studio
            </text>
          </g>
        </svg>
      </div>

      {/* Brand title and subtitle next to the badge */}
      {showSubtitle && (
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-xl leading-none text-stone-900 tracking-tight flex items-center gap-1.5">
            Munthings
            <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
              Pins &amp; Stickers
            </span>
          </span>
          <span className="text-xs font-medium text-teal-800 tracking-normal mt-0.5">
            by Barth&apos;s Studio
          </span>
        </div>
      )}
    </div>
  );
};
