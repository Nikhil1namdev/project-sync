import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../utils/toast.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Direct call to the backend real Resend email API
      const response = await axios.post('http://localhost:8000/auth/forgot-password', { email });
      showToast.success(response.data.message || "Recovery link sent! Please check your email inbox.");
      // Redirect back to login after short delay
      setTimeout(() => {
        navigate('/Login');
      }, 3000);
    } catch (error) {
      console.error("Recovery Error:", error);
      const msg = error.response?.data?.message || "Failed to send recovery link. Please try again.";
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* LEFT SIDE: SaaS Branding & Benefits Panel (Consistent with Login Screen) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        {/* Top brand */}
        <Link to="/" className="flex items-center space-x-3 group relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-blue-700 font-black text-xl shadow-lg">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">
            Project-Sync
          </span>
        </Link>

        {/* Core Selling Points */}
        <div className="relative z-10 my-auto space-y-8 max-w-lg">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">
            Recover your workspace connection instantly.
          </h2>
          <p className="text-lg text-blue-100 font-medium">
            Lost your credentials? No worries. We'll send a secure password recovery link to get you back to planning.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="font-bold text-white">Secure Encrypted Recovery</h4>
                <p className="text-sm text-blue-200">Session links are signed and automatically expire to protect your workspace.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-sm text-blue-200/60 relative z-10">
          © {new Date().getFullYear()} Project-Sync. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Recovery Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Recovery Header */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/25">
              P
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Can't log in?
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We'll send a recovery link to your email address.
            </p>
          </div>

          <form onSubmit={handleSendRecovery} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="recoveryEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Enter email
              </label>
              <input
                id="recoveryEmail"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Submit Recovery Link Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending recovery link...</span>
                </>
              ) : (
                <span>Send recovery link</span>
              )}
            </button>
          </form>

          {/* Return to Log In Link */}
          <div className="text-center pt-2">
            <Link 
              to="/Login"
              className="text-blue-600 hover:underline font-bold dark:text-blue-400 text-sm cursor-pointer"
            >
              Return to log in
            </Link>
          </div>

          {/* Footnote branding */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center select-none space-y-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Project-Sync</div>
            <div className="text-[10px] text-slate-450 dark:text-slate-550 font-medium">
              One account for all your synchronized workspaces.
            </div>
            <div className="flex justify-center space-x-4 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span className="hover:underline cursor-pointer">Login help</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:underline cursor-pointer">Contact Support</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;
