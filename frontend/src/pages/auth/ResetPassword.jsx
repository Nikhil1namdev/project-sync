import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../utils/apiClient.js';
import { showToast } from '../../utils/toast.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Read the secure JWT token from the recovery link URL query parameters

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if token exists
    if (!token) {
      showToast.error("Invalid reset link. Token is missing.");
      return;
    }

    // Client-side confirmation matching checks
    if (password !== confirmPassword) {
      showToast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      showToast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // API call validating token and updating credentials in MongoDB
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword: password
      });

      showToast.success(response.data.message || "Password successfully reset! Redirection to login.");
      setTimeout(() => {
        navigate('/Login');
      }, 2500);
    } catch (error) {
      console.error("Reset Password Error:", error);
      const msg = error.response?.data?.message || "Failed to reset password. The link might have expired.";
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* LEFT SIDE: Consistent SaaS Benefits Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="flex items-center space-x-3 group relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-blue-700 font-black text-xl shadow-lg">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">
            Project-Sync
          </span>
        </div>

        <div className="relative z-10 my-auto space-y-8 max-w-lg">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">
            Secure password recovery protection.
          </h2>
          <p className="text-lg text-blue-100 font-medium">
            Reset your credentials securely. Choose a strong combination to protect your sprints and messages.
          </p>
        </div>

        <div className="text-sm text-blue-200/60 relative z-10">
          © {new Date().getFullYear()} Project-Sync. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Password Reset Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/25">
              P
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Reset your password
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please enter your new strong password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            
            {/* New Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white focus:outline-none text-sm font-bold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Submit Reset Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Resetting password...</span>
              ) : (
                <span>Reset password</span>
              )}
            </button>
          </form>

          {/* Footer branding */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center select-none space-y-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Project-Sync</div>
            <div className="text-[10px] text-slate-450 dark:text-slate-550 font-medium">
              One account for all your synchronized workspaces.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ResetPassword;
