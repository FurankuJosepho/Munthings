import React from 'react';
import { ShieldAlert, X, LogIn, ArrowRight } from 'lucide-react';

export const UnauthorizedModal = ({
  isOpen,
  userInfo,
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full border border-rose-300 shadow-2xl overflow-hidden my-6 text-center p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="unauthorized-title"
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title and Summary */}
        <div className="space-y-1.5">
          <h3 id="unauthorized-title" className="font-display font-bold text-xl text-stone-900 tracking-tight">
            Access Not Authorized
          </h3>
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">
            You have been logged out immediately
          </p>
        </div>

        {/* Explanation and Account Details */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs">
          <p className="text-stone-700 leading-relaxed">
            The account you used is not registered as the authorized Studio Administrator:
          </p>
          <div className="space-y-1.5 font-mono text-[11px] bg-white/90 p-2.5 rounded-xl border border-rose-200/60 text-stone-700">
            <div className="truncate">
              <span className="text-stone-400">Email: </span>
              <strong className="text-stone-900 font-semibold">{userInfo?.email || 'N/A'}</strong>
            </div>
            <div className="break-all">
              <span className="text-stone-400">UID: </span>
              <span className="text-stone-600">{userInfo?.uid || 'N/A'}</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-600 leading-normal pt-1">
            Studio administration and inventory publishing are strictly locked to user ID:
            <br />
            <span className="font-mono font-bold text-stone-900 bg-amber-100/80 px-1.5 py-0.5 rounded mt-1 inline-block">
              lxumuDReWmMb1UAi3wGKSoM4nTr2
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="w-full py-3 px-5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Admin Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close &amp; Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
