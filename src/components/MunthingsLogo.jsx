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
