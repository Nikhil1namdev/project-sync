import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  // Stagger variants for the features badges row
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <section className="relative overflow-hidden bg-[#020617] text-slate-100 py-16 lg:py-24 border-b border-slate-900">
      
      {/* Grid overlay & radial glowing backgrounds (Atlassian + Vercel vibe) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] -z-10"></div>
      <div 
        className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Glowing spotlight gradient lights behind text */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Feature Badges - Animated Stagger Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-3.5 mb-8"
        >
          <motion.span 
            variants={badgeVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-md transition shadow-sm cursor-default"
          >
            💬 Real-time Chat
          </motion.span>
          <motion.span 
            variants={badgeVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 backdrop-blur-md transition shadow-sm cursor-default"
          >
            📋 Kanban Boards
          </motion.span>
          <motion.span 
            variants={badgeVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 backdrop-blur-md transition shadow-sm cursor-default"
          >
            🔐 Google OAuth
          </motion.span>
          <motion.span 
            variants={badgeVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md transition shadow-sm cursor-default"
          >
            🚀 Live Sync DB
          </motion.span>
        </motion.div>

        {/* Hero Title & Subtext Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-white leading-[1.15] mb-6">
            Plan, track, and collaborate faster with{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent bg-[size:200%] animate-[gradient_8s_linear_infinite]">
              Project-Sync
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            A real-time collaborative workspace for teams to manage projects, tasks, discussions, and delivery in one place.
          </p>

          {/* Call-to-Actions Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/Signup"
                className="block w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-center cursor-pointer"
              >
                Get started for free
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/Login"
                className="block w-full sm:w-auto px-8 py-3.5 bg-slate-900/60 border border-slate-800 text-slate-200 font-bold rounded-xl hover:bg-slate-850/80 transition-all text-center backdrop-blur-md cursor-pointer"
              >
                View demo dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard Mockup - Slow floating animation (Linear + Vercel aesthetic) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }}
            className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,112,184,0.08)] overflow-hidden"
          >
            {/* Header frame dots */}
            <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-900">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 bg-slate-900/80 px-6 py-1 rounded-full border border-slate-800/30 select-none">
                app.project-sync.com/JiraDashboard
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                PS
              </div>
            </div>

            {/* Simulated UI Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
              
              {/* Column 1: TODO */}
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900/50">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">📋 Todo List</span>
                  <span className="bg-slate-800/80 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 hover:border-slate-700 transition shadow-sm cursor-pointer">
                    <div className="text-xs font-semibold text-slate-200 mb-2">Configure JWT Security Middleware</div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>PROJ-10</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">High</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 hover:border-slate-700 transition shadow-sm cursor-pointer">
                    <div className="text-xs font-semibold text-slate-200 mb-2">Connect Stripe Checkout Endpoint</div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>PROJ-12</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">Medium</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: IN PROGRESS */}
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900/50">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">⏳ In Progress</span>
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">1</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-950/80 p-3.5 rounded-lg border border-blue-500/50 shadow-sm cursor-pointer">
                    <div className="text-xs font-semibold text-slate-200 mb-2">Redesign Landing SaaS Page</div>
                    <p className="text-[11px] text-slate-400 mb-2.5">Adding high-fidelity visuals and beautiful responsiveness.</p>
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>PROJ-18</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">High</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: WORKSPACE CHAT */}
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900/50 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center space-x-2 mb-3.5 border-b border-slate-850 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">💬 Active Workspace Chat</span>
                  </div>
                  <div className="space-y-2.5 text-[11px] overflow-y-auto max-h-[140px]">
                    <div>
                      <span className="font-bold text-blue-400">Dev J.</span>: <span className="text-slate-300">Just pushed socket code update!</span>
                    </div>
                    <div>
                      <span className="font-bold text-purple-400">Nitin S.</span>: <span className="text-slate-300">Wow, that feels incredibly fast now.</span>
                    </div>
                    <div className="bg-blue-500/5 p-2 rounded border border-blue-500/10">
                      <span className="font-bold text-blue-400">System</span>: <span className="text-slate-400 italic">User registered successfully via Google OAuth</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="relative">
                    <input
                      disabled
                      type="text"
                      placeholder="Type message to team..."
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 pl-3 pr-8 text-[11px] focus:outline-none placeholder-slate-600 cursor-default"
                    />
                    <button disabled className="absolute right-2 top-2 text-slate-600">
                      ✈️
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
