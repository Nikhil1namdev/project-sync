import React, { useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';
import apiClient from '../../utils/apiClient.js';
import { showToast } from '../../utils/toast.js';

const LoginOne = () => {
  const navigate = useNavigate();
  const { setLogin, setUser, setUserEmail, setProfilePic, getRedirectPath } = useContext(LoginContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-redirect if already logged in to prevent back-navigation to login page
  React.useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          getRedirectPath(parsed.token).then(path => navigate(path, { replace: true }));
        }
      } catch (e) {
        console.error("Error evaluating redirect path in LoginOne:", e);
      }
    }
  }, [navigate, getRedirectPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/Login', { email, password });
      const { name, email: userEmail, profilepic } = response.data.user;
      const token = response.data.token;
      const obj = { email: userEmail, name, token, profilepic };
      
      setUser(obj.name);
      setUserEmail(obj.email);
      setProfilePic(obj.profilepic || null);
      localStorage.setItem('userInfo', JSON.stringify(obj));
      setLogin(true);
      
      showToast.success("Logged in successfully! Welcome back.");
      const redirectPath = await getRedirectPath(token);
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message;
      if (error.response?.status === 401 || msg?.toLowerCase().includes("invalid")) {
        showToast.error("Invalid email or password");
      } else {
        showToast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async (authResult) => {
    setLoading(true);
    try {
      if (authResult["code"]) {
        const response = await apiClient.get(`/auth/google-auth?code=${authResult.code}`);
        const { name, email: userEmail, profilepic } = response.data.user;
        const token = response.data.token;
        const obj = { email: userEmail, name, token, profilepic };
        
        setUser(obj.name);
        setUserEmail(obj.email);
        setProfilePic(obj.profilepic || null);
        localStorage.setItem('userInfo', JSON.stringify(obj));
        setLogin(true);

        showToast.success("Logged in successfully with Google!");
        const redirectPath = await getRedirectPath(token);
        navigate(redirectPath);
      } else {
        throw new Error("No authorization code returned from Google");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      showToast.error("Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (err) => {
      console.error(err);
      showToast.error("Google login failed.");
    },
    flow: 'auth-code'
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* LEFT SIDE: SaaS Branding & Benefits Panel */}
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
            Plan, track, and deliver in one unified canvas.
          </h2>
          <p className="text-lg text-blue-100 font-medium">
            Connect your team in real time with synchronized boards, visual metrics, and integrated chat discussions.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <span className="text-xl">📋</span>
              <div>
                <h4 className="font-bold text-white">Dynamic Kanban Boards</h4>
                <p className="text-sm text-blue-200">Move tasks smoothly, organize columns, and monitor delivery flows.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">💬</span>
              <div>
                <h4 className="font-bold text-white">Instant Team Messages</h4>
                <p className="text-sm text-blue-200">Chat with teammates directly inside your active workspace dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-sm text-blue-200/60 relative z-10">
          © {new Date().getFullYear()} Project-Sync. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Auth Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        
        <div className="w-full max-w-md space-y-8">
          
          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your credentials to access your workspaces.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
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

            {/* Premium "Remember me" Checkbox */}
            <div className="flex items-center space-x-2.5">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4.5 w-4.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition duration-150"
              />
              <label 
                htmlFor="rememberMe" 
                className="text-[12px] font-bold text-slate-500 dark:text-slate-400 select-none cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
              >
                Remember me
              </label>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>

            {/* SSO Separator */}
            <div className="flex items-center justify-between py-2">
              <span className="w-[42%] border-b dark:border-slate-800"></span>
              <span className="text-xs font-bold text-slate-400 uppercase">or</span>
              <span className="w-[42%] border-b dark:border-slate-800"></span>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => GoogleLogin()}
              className="w-full flex items-center justify-center space-x-3 border border-slate-200 bg-white py-3 rounded-xl hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 transition disabled:opacity-50 cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Direct Links to Recovery & Sign Up (Atlassian Style footer) */}
          <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-slate-500 dark:text-slate-400 select-none">
            <Link 
              to="/forgot-password"
              className="text-blue-600 hover:underline font-bold dark:text-blue-400 cursor-pointer"
            >
              Can't log in?
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <Link to="/Signup" className="text-blue-600 hover:underline font-bold dark:text-blue-400">
              Create an account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginOne;
