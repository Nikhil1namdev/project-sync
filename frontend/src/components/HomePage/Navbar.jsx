import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null); // 'products' | 'solutions' | 'why' | 'resources' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // Mega-menu data definitions (consistent premium copy)
  const productsData = [
    {
      category: "Planning & Tracking",
      items: [
        { name: "📋 Kanban Board", desc: "Configure task cards, drag columns, and monitor delivery flows in real time." },
        { name: "📊 Issue Spreadsheet Tracker", desc: "Supercharged, high-performance CRUD grid views for large backlog listings." }
      ]
    },
    {
      category: "Real-time Collaboration",
      items: [
        { name: "💬 Real-time Team Chat", desc: "Exchange socket messages, log history, and check online flags instantly." },
        { name: "🏢 Team Workspace", desc: "Consolidate engineering, design, and product hubs under one roof." }
      ]
    },
    {
      category: "Security & Database",
      items: [
        { name: "🔐 Google OAuth SSO", desc: "Fast, frictionless single sign-on access without separate passwords." },
        { name: "🚀 Live Sync DB", desc: "Automated real-time updates pushed directly across active socket pipelines." }
      ]
    }
  ];

  const solutionsData = [
    {
      category: "Teams",
      items: [
        { name: "💻 Software Development", desc: "Trace bugs, organize features, and coordinate deployment schedules." },
        { name: "⚙️ IT Operations", desc: "Register service requests, coordinate ticket issues, and align support metrics." }
      ]
    },
    {
      category: "Work Management",
      items: [
        { name: "🎨 Marketing Projects", desc: "Plan marketing campaign cards, schedule tasks, and track creative assets." },
        { name: "📈 Product Discovery", desc: "Brainstorm ideas, compile team comments, and prioritize roadmap items." }
      ]
    }
  ];

  const whyData = [
    {
      category: "Core Advantages",
      items: [
        { name: "⚡ Pure Real-time Updates", desc: "No refreshing required. See changes immediately as colleagues drag cards." },
        { name: "🛠️ All-in-One Dashboard", desc: "Toggle seamlessly between To-Do tasks, spreadsheets, and team discussions." }
      ]
    },
    {
      category: "Architecture & Scale",
      items: [
        { name: "🛡️ Robust JWT Session", desc: "Persistent local token handlers ensuring secure session states on refresh." },
        { name: "🚀 Lightweight Stack", desc: "Tailwind CSS + Framer Motion for premium responsiveness and fast loading." }
      ]
    }
  ];

  const resourcesData = [
    {
      category: "Guides",
      items: [
        { name: "📖 Technical Docs Center", desc: "13 detailed local architecture guides covering routing, models, and databases." },
        { name: "💡 Pedagogical Comments", desc: "Interview-ready explanations built directly into core code files." }
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
            
            {/* Project-Sync Logo - Precise centering and sizing */}
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
              
              {/* Products Dropdown Trigger */}
              <div 
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMouseEnter('products')}
              >
                <button className={`flex items-center space-x-1 px-3 py-1.5 text-[13px] font-semibold rounded-md transition cursor-pointer ${activeMenu === 'products' ? 'text-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'}`}>
                  <span>Products</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'products' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Solutions Dropdown Trigger */}
              <div 
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMouseEnter('solutions')}
              >
                <button className={`flex items-center space-x-1 px-3 py-1.5 text-[13px] font-semibold rounded-md transition cursor-pointer ${activeMenu === 'solutions' ? 'text-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'}`}>
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'solutions' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Why Project-Sync Dropdown Trigger */}
              <div 
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMouseEnter('why')}
              >
                <button className={`flex items-center space-x-1 px-3 py-1.5 text-[13px] font-semibold rounded-md transition cursor-pointer ${activeMenu === 'why' ? 'text-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'}`}>
                  <span>Why Project-Sync?</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'why' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Resources Dropdown Trigger */}
              <div 
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMouseEnter('resources')}
              >
                <button className={`flex items-center space-x-1 px-3 py-1.5 text-[13px] font-semibold rounded-md transition cursor-pointer ${activeMenu === 'resources' ? 'text-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'}`}>
                  <span>Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'resources' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Pricing Link */}
              <div className="flex items-center h-full">
                <Link 
                  to="/pricing" 
                  className="px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50/60 rounded-md transition"
                >
                  Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Actions, Search, Profile Grid Icons */}
          <div className="hidden lg:flex items-center space-x-3.5">
            
            {/* Search Icon */}
            <button className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <Search className="w-4 h-4" />
            </button>

            {/* Grid Apps Icon */}
            <button className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <Grid className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-200"></span>

            {/* Auth Actions */}
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

      {/* MEGA-MENU PANELS: Rendered with smooth Framer Motion height/fade transitions */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 w-full bg-white border-b border-gray-200 shadow-xl z-40 hidden lg:block"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">
              
              {/* Products content */}
              {activeMenu === 'products' && productsData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    {col.category}
                  </h4>
                  <div className="space-y-2">
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx} 
                        to="/JiraDashboard" 
                        className="group block p-2 hover:bg-slate-50/80 rounded-xl transition"
                      >
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Solutions content */}
              {activeMenu === 'solutions' && solutionsData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    {col.category}
                  </h4>
                  <div className="space-y-2">
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx} 
                        to="/ToDoList" 
                        className="group block p-2 hover:bg-slate-50/80 rounded-xl transition"
                      >
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Why content */}
              {activeMenu === 'why' && whyData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    {col.category}
                  </h4>
                  <div className="space-y-2">
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx} 
                        to="/" 
                        className="group block p-2 hover:bg-slate-50/80 rounded-xl transition"
                      >
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Resources content */}
              {activeMenu === 'resources' && resourcesData.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    {col.category}
                  </h4>
                  <div className="space-y-2">
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx} 
                        to="/" 
                        className="group block p-2 hover:bg-slate-50/80 rounded-xl transition"
                      >
                        <h5 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          {item.desc}
                        </p>
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
            <Link to="/ToDoList" className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Solutions</Link>
            <Link to="/" className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Why Project-Sync?</Link>
            <Link to="/" className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Resources</Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">Pricing</Link>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2.5">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
