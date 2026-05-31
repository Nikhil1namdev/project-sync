import React, { useState, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast.js';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

const SignUp = () => {
  const navigate = useNavigate();
  const { getRedirectPath } = useContext(LoginContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if already logged in to prevent back-navigation to signup page
  React.useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          getRedirectPath(parsed.token).then(path => navigate(path, { replace: true }));
        }
      } catch (e) {
        console.error("Error evaluating redirect path in Signup:", e);
      }
    }
  }, [navigate, getRedirectPath]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/Signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      showToast.success(response.data.message || "Account created successfully!");
      navigate('/Login');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Signup failed. Please try again.";
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* LEFT SIDE: SaaS Branding & Benefits Panel (Matches LoginOne exactly) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
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
            Build the future, step by synchronized step.
          </h2>
          <p className="text-lg text-blue-100 font-medium">
            Join thousands of developers and collaboration leaders organizing their delivery pipelines in real time.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <span className="text-xl">📊</span>
              <div>
                <h4 className="font-bold text-white">Full-scale Issue CRUD</h4>
                <p className="text-sm text-blue-200">Track and filter critical backlog records using powerful visual grids.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="font-bold text-white">Fast Google Integration</h4>
                <p className="text-sm text-blue-200">Access your dashboard workspace instantly using streamlined SSO login.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-sm text-blue-200/60 relative z-10">
          © {new Date().getFullYear()} Project-Sync. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Signup Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create an account
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Get started with your free Project-Sync workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Devansh Jain"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white focus:outline-none text-sm font-bold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Direct Link to Log In */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/Login" className="text-blue-600 hover:underline font-bold dark:text-blue-400">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SignUp;
