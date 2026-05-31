import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * AccountLayout — Shared shell for all /account/* pages.
 * Centered content, top horizontal nav tabs, premium dark-mode support,
 * matching Atlassian's clean account settings UI.
 */
const AccountLayout = () => {
  const navigate = useNavigate();
  const { User: userName, userEmail, profilePic } = useContext(LoginContext);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems = [
    { to: '/account/profile-and-visibility', label: 'Profile and visibility' },
    { to: '/account/email',                  label: 'Email'                  },
    { to: '/account/security',               label: 'Security'               },
    { to: '/account/privacy',                label: 'Privacy'                },
    { to: '/account/preferences',            label: 'Account preferences'    },
    { to: '/account/connected-apps',         label: 'Connected apps'         },
    { to: '/account/link-preferences',       label: 'Link preferences'       },
    { to: '/account/product-settings',       label: 'Product settings'       },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Account Header - Atlassian Style */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              {profilePic ? (
                <img src={profilePic} alt={userName} className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/30" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                  {getInitials(userName)}
                </div>
              )}
              <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-350 truncate hidden sm:inline max-w-[120px]">
                {userName || 'User'}
              </span>
            </div>
          </div>
          
          <div>
            <span className="text-[14px] font-black text-slate-850 dark:text-slate-200 tracking-tight">
              PROJECT-SYNC <span className="font-light text-slate-500 dark:text-slate-450">Account</span>
            </span>
          </div>
        </div>
      </header>

      {/* Top Horizontal Nav Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[53px] z-30 overflow-x-auto scrollbar-none">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-5 md:gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `pb-2.5 pt-3 px-0.5 border-b-2 text-[13px] font-bold transition-colors whitespace-nowrap cursor-pointer block ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Centered Main Page Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <main className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

    </div>
  );
};

export default AccountLayout;
