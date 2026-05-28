import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Shield, Settings, RefreshCw, ChevronRight } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * AccountDropdown — Atlassian-style account menu
 * Shows on click of the user avatar/name in the Navbar.
 * Provides: Switch Account, Profile, Licenses, Log out
 */
const AccountDropdown = ({ isOpen, onClose }) => {
  const navigate    = useNavigate();
  const dropdownRef = useRef(null);
  const { User, userEmail, profilePic, logOut } = useContext(LoginContext);

  // Generate initials from full name
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
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: handleSwitchAccount,
      dividerAfter: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: handleProfile,
      dividerAfter: false,
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: <Shield className="w-4 h-4" />,
      onClick: handleLicenses,
      dividerAfter: true,
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: <LogOut className="w-4 h-4" />,
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
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[9999] overflow-hidden"
          style={{ transformOrigin: 'top right' }}
        >
          {/* User Header */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={User}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {getInitials(User)}
                  </div>
                )}
              </div>
              {/* Name + Email */}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-slate-900 truncate">{User || 'User'}</p>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
                  {userEmail || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1.5">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors group cursor-pointer
                    ${item.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                >
                  <span className={`transition-colors ${item.danger ? 'text-red-500' : 'text-slate-400 group-hover:text-blue-500'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {!item.danger && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  )}
                </button>
                {item.dividerAfter && (
                  <div className="mx-4 my-1 border-t border-slate-100" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Footer branding */}
          <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/60">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Project-Sync Account
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountDropdown;
