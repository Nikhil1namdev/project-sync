import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield } from 'lucide-react';

/**
 * PrivacyPage — /account/privacy
 * Renders Atlassian-style Privacy controls and a cookie preference manager
 * with full dark-mode support and polished transitions.
 */
const PrivacyPage = () => {
  const [modalOpen,         setModalOpen]         = useState(false);
  const [necessaryCookies,  setNecessaryCookies]  = useState(true);  // always on
  const [analyticsCookies,  setAnalyticsCookies]  = useState(false);
  const [personalization,   setPersonalization]   = useState(false);
  const [saved,             setSaved]             = useState(false);

  const handleSave = () => {
    localStorage.setItem('cookiePrefs', JSON.stringify({
      necessary:     true,
      analytics:     analyticsCookies,
      personalization,
    }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setModalOpen(false);
    }, 1200);
  };

  const handleAcceptAll = () => {
    setAnalyticsCookies(true);
    setPersonalization(true);
    // Directly save and dismiss
    localStorage.setItem('cookiePrefs', JSON.stringify({
      necessary:     true,
      analytics:     true,
      personalization: true,
    }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setModalOpen(false);
    }, 1200);
  };

  const Toggle = ({ checked, onChange, disabled = false, id }) => (
    <button
      id={id}
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-checked={checked}
      role="switch"
      disabled={disabled}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Privacy</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
          Because your privacy is important to us, we're transparent about how we collect, use, and share information about you.
        </p>
      </div>

      {/* Cookie Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/20 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h3 className="text-[15px] font-black text-slate-900 dark:text-white">Cookie preferences</h3>
              <p className="text-[12.5px] text-slate-600 dark:text-slate-350 leading-relaxed">
                When you visit our product, it may store or retrieve information from your browser, mostly in the form of cookies.
                This information may be about you, your preferences, or your device, and is mostly used to make the site work
                as you would expect. The information doesn't usually directly identify you, but it provides a more personalized
                web experience. We respect your right to privacy, so you can select which cookies you allow.
              </p>
            </div>
            
            <button
              id="open-cookie-prefs-btn"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[13px] font-bold rounded-xl transition cursor-pointer"
            >
              Open cookie preferences
            </button>
          </div>
        </div>
      </div>

      {/* More Info Privacy */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-2 transition-colors">
        <h3 className="text-[15px] font-black text-slate-900 dark:text-white">Privacy Policy</h3>
        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
          To learn more about how we handle your data, read our full privacy policy. We are fully committed to protecting your personal information and being transparent about our engineering practices.
        </p>
      </div>

      {/* ─── COOKIE MODAL ─── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setModalOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden transition-colors"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Cookie className="w-5 h-5 text-amber-500" />
                    <h2 className="text-[15px] font-black text-slate-900 dark:text-white">Cookie Preferences</h2>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cookie Categories */}
                <div className="px-6 py-5 space-y-5">
                  {/* Necessary */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">Necessary cookies</p>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Required for the site and auth persistence to function properly. Cannot be disabled.
                      </p>
                    </div>
                    <Toggle
                      id="necessary-toggle"
                      checked={necessaryCookies}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800" />

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">Analytics cookies</p>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Help us understand how users interact with dashboard views and sprint lists.
                      </p>
                    </div>
                    <Toggle
                      id="analytics-toggle"
                      checked={analyticsCookies}
                      onChange={setAnalyticsCookies}
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800" />

                  {/* Personalization */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">Personalization cookies</p>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Used to preserve layout configurations, sprint modes, and customization choices.
                      </p>
                    </div>
                    <Toggle
                      id="personalization-toggle"
                      checked={personalization}
                      onChange={setPersonalization}
                    />
                  </div>
                </div>

                {/* Success Indicator */}
                {saved && (
                  <div className="px-6 pb-3">
                    <p className="text-[12.5px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Cookie choices updated!</p>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                  <button
                    id="save-cookie-prefs-btn"
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-[12.5px] font-bold rounded-xl transition cursor-pointer"
                  >
                    Save preferences
                  </button>
                  <button
                    id="accept-all-cookies-btn"
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-bold rounded-xl transition shadow-sm shadow-blue-500/10 cursor-pointer"
                  >
                    Accept all
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyPage;
