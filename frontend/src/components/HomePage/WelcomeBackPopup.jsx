import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * WelcomeBackPopup — Atlassian-style floating "pick up where you left off" card.
 * Shown on homepage when user is logged in, now with full dark-mode support.
 */
const WelcomeBackPopup = () => {
  const navigate = useNavigate();
  const { login, User, getRedirectPath } = useContext(LoginContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (login && !sessionStorage.getItem('welcomePopupDismissed')) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [login]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('welcomePopupDismissed', 'true');
  };

  const handleGo = async () => {
    handleDismiss();
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          const path = await getRedirectPath(parsed.token);
          navigate(path);
          return;
        }
      } catch (e) {
        console.error("WelcomeBackPopup redirection evaluation error:", e);
      }
    }
    navigate('/JiraDashboard');
  };

  const firstName = User ? User.split(' ')[0] : 'there';

  return (
    <AnimatePresence>
      {visible && login && (
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed top-18 right-4 z-[9998] w-72 sm:w-80 font-sans"
          role="dialog"
          aria-label="Welcome back popup"
        >
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
            
            {/* Top accent gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-655 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="px-5 pt-4.5 pb-5">
              {/* Title & Description */}
              <h3 className="text-[14.5px] font-black text-slate-900 dark:text-white pr-6">
                Welcome back, {firstName} 👋
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                Pick up where you left off.
              </p>

              {/* App card row */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-xl">
                {/* Atlassian Jira Logo Symbol */}
                <div className="flex-shrink-0 w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-extrabold text-[12px]">J</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-extrabold text-slate-850 dark:text-white leading-tight">Jira</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bold truncate">
                    Project-Sync
                  </p>
                </div>
                {/* Action button */}
                <button
                  onClick={handleGo}
                  id="welcome-popup-go-btn"
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11.5px] font-black rounded-lg transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                  Go
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBackPopup;
