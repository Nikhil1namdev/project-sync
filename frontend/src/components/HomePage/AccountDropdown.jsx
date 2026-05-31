import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Shield, Settings, RefreshCw, ChevronRight } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * AccountDropdown — Atlassian-style account menu.
 * Triggered by clicking the avatar/name in the Navbar.
 * Displays user profile, email, switch account, profile link, licenses, and logout.
 */
const AccountDropdown = ({ isOpen, onClose }) => {
  const navigate    = useNavigate();
  const dropdownRef = useRef(null);
  const { User, userEmail, profilePic, logOut } = useContext(LoginContext);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logOut();
    onClose();
    navigate('/');
  };

  const handleProfile = () => {
    onClose();
    navigate('/account/profile-and-visibility');
  };

  const handleSwitchAccount = () => {
    onClose();
    navigate('/Login');
  };

  const handleLicenses = () => {
    onClose();
    navigate('/account/licenses');
  };

  const menuItems = [
    {
      id: 'switch',
      label: 'Switch Account',
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      onClick: handleSwitchAccount,
      dividerAfter: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserIcon className="w-3.5 h-3.5" />,
      onClick: handleProfile,
      dividerAfter: false,
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: <Shield className="w-3.5 h-3.5" />,
      onClick: handleLicenses,
      dividerAfter: true,
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: <LogOut className="w-3.5 h-3.5" />,
      onClick: handleLogout,
      danger: true,
      dividerAfter: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-[228px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[9999] overflow-hidden"
          style={{ transformOrigin: 'top right' }}
        >
          {/* User Header */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={User}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-50 dark:ring-blue-900/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {getInitials(User)}
                  </div>
                )}
              </div>
              {/* Name + Email */}
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-black text-slate-800 dark:text-white truncate">{User || 'User'}</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide select-all truncate">
                  {userEmail || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-[12.5px] font-bold transition-colors group cursor-pointer
                    ${item.danger
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  <span className={`transition-colors ${item.danger ? 'text-red-500 dark:text-red-400' : 'text-slate-400 group-hover:text-blue-500'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {!item.danger && (
                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-400 transition-colors" />
                  )}
                </button>
                {item.dividerAfter && (
                  <div className="mx-3.5 my-1 border-t border-slate-100 dark:border-slate-800" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Footer branding */}
          <div className="px-4 py-2 border-t border-slate-50 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30">
            <p className="text-[9.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Project-Sync Account
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountDropdown;
