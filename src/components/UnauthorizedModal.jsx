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
            Please logged out immediately!
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
