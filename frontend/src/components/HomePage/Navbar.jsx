import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, ChevronDown, Menu, X } from 'lucide-react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';
import AccountDropdown from './AccountDropdown.jsx';

/**
 * Navbar — Auth-aware top navigation bar.
 *
 * LOGGED-IN STATE:
 *   - Shows circular avatar (initials or Google photo).
 *   - Shows user full name.
 *   - Clicking avatar/name opens <AccountDropdown />.
 *   - Login/Sign-up buttons are hidden.
 *
 * LOGGED-OUT STATE:
 *   - Shows normal Login / Sign up buttons.
 */
const Navbar = () => {
  const [activeMenu, setActiveMenu]       = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen]   = useState(false);

  const { login, User, profilePic } = useContext(LoginContext);

  const handleMouseEnter = (menuName) => setActiveMenu(menuName);
  const handleMouseLeave = ()         => setActiveMenu(null);

  // Generate initials from full name (e.g. "Nikhil Namdev" → "NN")
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mega-menu data definitions
  const productsData = [
    {
      category: "Planning & Tracking",
      items: [
        { name: "📋 Kanban Board",              desc: "Configure task cards, drag columns, and monitor delivery flows in real time." },
        { name: "📊 Issue Spreadsheet Tracker", desc: "Supercharged, high-performance CRUD grid views for large backlog listings."  }
      ]
    },
    {
      category: "Real-time Collaboration",
      items: [
        { name: "💬 Real-time Team Chat", desc: "Exchange socket messages, log history, and check online flags instantly." },
        { name: "🏢 Team Workspace",      desc: "Consolidate engineering, design, and product hubs under one roof."          }
      ]
    },
    {
      category: "Security & Database",
      items: [
        { name: "🔐 Google OAuth SSO", desc: "Fast, frictionless single sign-on access without separate passwords." },
        { name: "🚀 Live Sync DB",     desc: "Automated real-time updates pushed directly across active socket pipelines." }
      ]
    }
  ];

  const solutionsData = [
    {
      category: "Teams",
      items: [
        { name: "💻 Software Development", desc: "Trace bugs, organize features, and coordinate deployment schedules." },
        { name: "⚙️ IT Operations",         desc: "Register service requests, coordinate ticket issues, and align support metrics." }
      ]
    },
    {
      category: "Work Management",
      items: [
        { name: "🎨 Marketing Projects", desc: "Plan marketing campaign cards, schedule tasks, and track creative assets." },
        { name: "📈 Product Discovery",  desc: "Brainstorm ideas, compile team comments, and prioritize roadmap items."   }
      ]
    }
  ];

  const whyData = [
    {
      category: "Core Advantages",
      items: [
        { name: "⚡ Pure Real-time Updates", desc: "No refreshing required. See changes immediately as colleagues drag cards." },
        { name: "🛠️ All-in-One Dashboard",  desc: "Toggle seamlessly between To-Do tasks, spreadsheets, and team discussions." }
      ]
    },
    {
      category: "Architecture & Scale",
      items: [
        { name: "🛡️ Robust JWT Session", desc: "Persistent local token handlers ensuring secure session states on refresh." },
        { name: "🚀 Lightweight Stack",   desc: "Tailwind CSS + Framer Motion for premium responsiveness and fast loading."  }
      ]
    }
  ];

  const resourcesData = [
    {
      category: "Guides",
      items: [
        { name: "📖 Technical Docs Center", desc: "13 detailed local architecture guides covering routing, models, and databases." },
        { name: "💡 Pedagogical Comments",  desc: "Interview-ready explanations built directly into core code files."          }
      ]
    },
    {
      category: "Integrations",
      items: [
        { name: "🔗 API Signature Center", desc: "Explore database controller payloads, models, and websocket channels." }
      ]
    }
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* LEFT: Logo & Main Navigation Links */}
          <div className="flex items-center space-x-6 h-full">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group py-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white font-black text-xs shadow-sm shadow-blue-500/10 group-hover:scale-105 transition-all">
                P
              </div>
              <span className="text-[15px] font-bold tracking-tight text-slate-800">
                Project-<span className="text-blue-600">Sync</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-0.5 h-full">

              {[
                { key: 'products',   label: 'Products'          },
                { key: 'solutions',  label: 'Solutions'         },
                { key: 'why',        label: 'Why Project-Sync?' },
                { key: 'resources',  label: 'Resources'         },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="relative flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter(key)}
                >
                  <button className={`flex items-center space-x-1 px-3 py-1.5 text-[13px] font-semibold rounded-md transition cursor-pointer ${
                    activeMenu === key
                      ? 'text-blue-600 bg-blue-50/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'
                  }`}>
                    <span>{label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === key ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                  </button>
                </div>
              ))}

              <div className="flex items-center h-full">
                <Link to="/pricing" className="px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50/60 rounded-md transition">
                  Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Auth-aware Actions */}
          <div className="hidden lg:flex items-center space-x-3.5">

            {/* Search Icon */}
            <button className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <Search className="w-4 h-4" />
            </button>

            {/* Grid Apps Icon */}
            <button className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <Grid className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-200" />

            {/* ─── LOGGED IN: Avatar + Name + Dropdown ─── */}
            {login ? (
              <div className="relative">
                <button
                  id="nav-account-btn"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  aria-label="Open account menu"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={User}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] shadow-sm flex-shrink-0">
                      {getInitials(User)}
                    </div>
                  )}
                  {/* Name */}
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600 transition max-w-[120px] truncate">
                    {User}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </button>

                {/* Account Dropdown */}
                <AccountDropdown
                  isOpen={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                />
              </div>
            ) : (
              /* ─── LOGGED OUT: Login + Sign up ─── */
              <>
                <Link
                  to="/Login"
                  className="text-[13px] font-bold text-slate-600 hover:text-blue-600 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/Signup"
                  className="px-3.5 py-1.5 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MEGA-MENU PANELS */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 w-full bg-white border-b border-gray-200 shadow-xl z-40 hidden lg:block"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">

              {activeMenu === 'products' && productsData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">{col.category}</h4>
                  <div className="space-y-2">
                    {col.items.map((item, i) => (
                      <Link key={i} to="/JiraDashboard" className="group block p-2 hover:bg-slate-50/80 rounded-xl transition">
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">{item.name}</h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {activeMenu === 'solutions' && solutionsData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">{col.category}</h4>
                  <div className="space-y-2">
                    {col.items.map((item, i) => (
                      <Link key={i} to="/ToDoList" className="group block p-2 hover:bg-slate-50/80 rounded-xl transition">
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">{item.name}</h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {activeMenu === 'why' && whyData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">{col.category}</h4>
                  <div className="space-y-2">
                    {col.items.map((item, i) => (
                      <Link key={i} to="/" className="group block p-2 hover:bg-slate-50/80 rounded-xl transition">
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">{item.name}</h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {activeMenu === 'resources' && resourcesData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">{col.category}</h4>
                  <div className="space-y-2">
                    {col.items.map((item, i) => (
                      <Link key={i} to="/" className="group block p-2 hover:bg-slate-50/80 rounded-xl transition">
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">{item.name}</h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-inner">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation</h4>
            <Link to="/JiraDashboard" className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Products</Link>
            <Link to="/ToDoList"      className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Solutions</Link>
            <Link to="/"             className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Why Project-Sync?</Link>
            <Link to="/"             className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Resources</Link>
            <Link to="/pricing"      className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Pricing</Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2.5">
            {login ? (
              <>
                {/* Mobile: logged in state */}
                <Link
                  to="/JiraDashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/account/profile-and-visibility"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link
                  to="/Signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
