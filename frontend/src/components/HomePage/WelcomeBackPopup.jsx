import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * WelcomeBackPopup — Atlassian-style floating "pick up where you left off" card.
 * Shown on homepage when user is logged in.
 * Persists within the session (dismissed state tracked in sessionStorage).
 * "Go" button redirects to /JiraDashboard.
 */
const WelcomeBackPopup = () => {
  const navigate = useNavigate();
  const { login, User } = useContext(LoginContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if logged in and not already dismissed this session
    if (login && !sessionStorage.getItem('welcomePopupDismissed')) {
      // Small delay so it doesn't flash immediately on route change
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [login]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('welcomePopupDismissed', 'true');
  };

  const handleGo = () => {
    handleDismiss();
    navigate('/JiraDashboard');
  };

  // Extract first name
  const firstName = User ? User.split(' ')[0] : 'there';

  return (
    <AnimatePresence>
      {visible && login && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed top-20 right-4 z-[9998] w-72 sm:w-80"
          role="dialog"
          aria-label="Welcome back popup"
        >
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-slate-100 overflow-hidden">
            
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-5 pt-4 pb-5">
              {/* Title */}
              <h3 className="text-[15px] font-black text-slate-900 pr-6">
                Welcome back, {firstName} 👋
              </h3>
              <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                Pick up where you left off.
              </p>

              {/* App card */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                {/* Jira-like icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-[13px]">J</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-800 leading-tight">Jira Board</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Project-Sync Workspace
                  </p>
                </div>
                {/* Go button */}
                <button
                  onClick={handleGo}
                  id="welcome-popup-go-btn"
                  className="flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  Go
                  <ArrowRight className="w-3.5 h-3.5" />
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
