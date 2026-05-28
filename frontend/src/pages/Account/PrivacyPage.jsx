import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

/**
 * PrivacyPage — /account/privacy
 * Matches Atlassian's Privacy tab exactly:
 * - Privacy explanation paragraph
 * - Cookie preferences section
 * - "Open cookie preferences" button → opens modal with 3 categories
 */
const PrivacyPage = () => {
  const [modalOpen,         setModalOpen]         = useState(false);
  const [necessaryCookies,  setNecessaryCookies]  = useState(true);  // always on
  const [analyticsCookies,  setAnalyticsCookies]  = useState(false);
  const [personalization,   setPersonalization]   = useState(false);
  const [saved,             setSaved]             = useState(false);

  const handleSave = () => {
    // Persist choices to localStorage
    localStorage.setItem('cookiePrefs', JSON.stringify({
      necessary:     true,
      analytics:     analyticsCookies,
      personalization,
    }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setModalOpen(false);
    }, 1500);
  };

  const handleAcceptAll = () => {
    setAnalyticsCookies(true);
    setPersonalization(true);
    handleSave();
  };

  const Toggle = ({ checked, onChange, disabled = false, id }) => (
    <button
      id={id}
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-checked={checked}
      role="switch"
      disabled={disabled}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Privacy</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Because your privacy is important to us, we're transparent about how we collect, use, and share information about you.
        </p>
      </div>

      {/* Cookie Preferences Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-black text-slate-900 mb-2">Cookie preferences</h3>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-5">
              When you visit our product, it may store or retrieve information from your browser, mostly in the form of cookies.
              This information may be about you, your preferences, or your device, and is mostly used to make the site work
              as you would expect. The information doesn't usually directly identify you, but it provides a more personalized
              web experience. We respect your right to privacy, so you can select which cookies you allow.
            </p>
            <button
              id="open-cookie-prefs-btn"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-[13px] font-bold rounded-xl transition cursor-pointer"
            >
              Open cookie preferences
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Link */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-[15px] font-black text-slate-900 mb-2">Privacy Policy</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          To learn more about how we handle your data, read our full privacy policy.
          We are committed to protecting your personal information and being transparent about our practices.
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              onClick={() => setModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-md overflow-hidden">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Cookie className="w-5 h-5 text-amber-500" />
                    <h2 className="text-[15px] font-black text-slate-900">Cookie Preferences</h2>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cookie Categories */}
                <div className="px-6 py-5 space-y-5">

                  {/* Necessary */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Necessary cookies</p>
                      <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                        Required for the site to function. Cannot be disabled.
                      </p>
                    </div>
                    <Toggle
                      id="necessary-toggle"
                      checked={necessaryCookies}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Analytics cookies</p>
                      <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                        Help us understand how you use the app so we can improve it.
                      </p>
                    </div>
                    <Toggle
                      id="analytics-toggle"
                      checked={analyticsCookies}
                      onChange={setAnalyticsCookies}
                    />
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Personalization */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Personalization cookies</p>
                      <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                        Allow us to remember your preferences and customize your experience.
                      </p>
                    </div>
                    <Toggle
                      id="personalization-toggle"
                      checked={personalization}
                      onChange={setPersonalization}
                    />
                  </div>
                </div>

                {/* Success message */}
                {saved && (
                  <div className="px-6 pb-2">
                    <p className="text-[13px] font-semibold text-emerald-600">✓ Preferences saved!</p>
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                  <button
                    id="save-cookie-prefs-btn"
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-[13px] font-bold rounded-xl transition cursor-pointer"
                  >
                    Save preferences
                  </button>
                  <button
                    id="accept-all-cookies-btn"
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyPage;
