import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Lock, Settings,
  Link as LinkIcon, Package, ChevronLeft
} from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * AccountLayout — Shared shell for all /account/* pages.
 * Provides the left-side navigation tabs and top header,
 * matching Atlassian's "Account Settings" look.
 */
const AccountLayout = () => {
  const navigate = useNavigate();
  const { User: userName, userEmail, profilePic } = useContext(LoginContext);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems = [
    { to: '/account/profile-and-visibility', label: 'Profile and visibility', icon: User     },
    { to: '/account/email',                  label: 'Email',                   icon: Mail     },
    { to: '/account/security',               label: 'Security',                icon: Lock     },
    { to: '/account/privacy',                label: 'Privacy',                 icon: Shield   },
    { to: '/account/preferences',            label: 'Account preferences',     icon: Settings },
    { to: '/account/connected-apps',         label: 'Connected apps',          icon: LinkIcon },
    { to: '/account/link-preferences',       label: 'Link preferences',        icon: Package  },
    { to: '/account/product-settings',       label: 'Product settings',        icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Top Account Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <span className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-3">
            {profilePic ? (
              <img src={profilePic} alt={userName} className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {getInitials(userName)}
              </div>
            )}
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{userName || 'User'}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{userEmail || ''}</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-[13px] font-black text-slate-700">
              Project-<span className="text-blue-600">Sync</span> · Account Settings
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

        {/* LEFT: Navigation Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
            </div>
            <ul className="py-1.5">
              {navItems.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* RIGHT: Page Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
