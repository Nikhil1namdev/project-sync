import React, { useEffect, useState, useCallback } from 'react';
import CreateLoginContext from './CreateLoginContext.js';
import axios from 'axios';

/**
 * INTERVIEW NOTE: LoginProvider uses the React Context API to broadcast global auth state.
 *
 * AUTH PERSISTENCE STRATEGY:
 * - On mount, it reads `userInfo` from localStorage to immediately restore login state
 *   (no flash of "logged-out" UI on refresh).
 * - Then it silently calls GET /auth/verify with the stored JWT to confirm the token is
 *   still valid server-side. If verification fails, the session is cleared automatically.
 * - This means: refresh → instant UI restore → silent token check → continued session.
 *
 * USER OBJECT SHAPE stored in localStorage:
 * { name, email, token, profilepic }
 */
const LoginProvider = ({ children }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Helper to safely parse localStorage
  const getStoredUserInfo = () => {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };

  const stored = getStoredUserInfo();

  // Rehydrate all auth fields from localStorage immediately — prevents UI flicker on refresh
  const [login, setLogin]       = useState(!!stored);
  const [User, setUser]         = useState(stored?.name    || null);
  const [token, setToken]       = useState(stored?.token   || null);
  const [userEmail, setUserEmail]     = useState(stored?.email    || null);
  const [profilePic, setProfilePic]   = useState(stored?.profilepic || null);
  const [authChecked, setAuthChecked] = useState(false); // true once verify call resolves

  /**
   * logOut — single source of truth for clearing session.
   * Called from dropdown, interceptors, or anywhere in the app.
   */
  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setLogin(false);
    setUser(null);
    setToken(null);
    setUserEmail(null);
    setProfilePic(null);
  }, []);

  /**
   * getRedirectPath — Centralized method to evaluate active workspace context.
   * Fetches projects from backend to decide if user should land on JiraDashboard or UserDashboard.
   */
  const decodeToken = (jwtToken) => {
    if (!jwtToken) return null;
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed:", e);
      return null;
    }
  };

  const getRedirectPath = useCallback(async (userToken) => {
    const activeToken = userToken || token || getStoredUserInfo()?.token;
    if (!activeToken) return '/Login';
    try {
      const response = await axios.get(`${apiBase}/api/projects`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const list = response.data.projects || [];
      
      // Decode JWT token to retrieve logged-in user's ID
      const decoded = decodeToken(activeToken);
      const userId = decoded?.id;
      
      // Filter projects owned by this user
      const userProjects = list.filter(p => p.owner === userId);
      
      if (userProjects.length > 0) {
        return '/JiraDashboard';
      } else {
        return '/UserDashboard';
      }
    } catch (error) {
      console.error("Error in getRedirectPath:", error);
      return '/UserDashboard';
    }
  }, [token, apiBase]);

  /**
   * On app mount: silently verify stored JWT with backend.
   * - If token valid   → refresh user data from server (keeps name/email fresh).
   * - If token invalid → clear stale session automatically.
   * - If backend down  → keep stored session (safe offline-first behaviour).
   */
  useEffect(() => {
    const storedInfo = getStoredUserInfo();
    if (!storedInfo?.token) {
      setAuthChecked(true);
      return;
    }

    axios.get(`${apiBase}/auth/verify`, {
      headers: { Authorization: `Bearer ${storedInfo.token}` }
    })
      .then(({ data }) => {
        if (data.valid) {
          // Refresh user data from server response
          const refreshed = {
            name:       data.user.name,
            email:      data.user.email,
            token:      storedInfo.token,
            profilepic: data.user.profilepic || storedInfo.profilepic || null,
          };
          localStorage.setItem('userInfo', JSON.stringify(refreshed));
          setLogin(true);
          setUser(refreshed.name);
          setToken(storedInfo.token);
          setUserEmail(refreshed.email);
          setProfilePic(refreshed.profilepic);
        } else {
          logOut();
        }
      })
      .catch((err) => {
        // 401 = invalid/expired token → log out
        if (err.response?.status === 401) {
          logOut();
        }
        // Network errors / server down → keep stored session (no logout)
        // User will be re-verified next time backend is reachable
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CreateLoginContext.Provider value={{
      User, setUser,
      login, setLogin,
      token, setToken,
      userEmail, setUserEmail,
      profilePic, setProfilePic,
      authChecked,
      logOut,
      getRedirectPath,
    }}>
      {children}
    </CreateLoginContext.Provider>
  );
};

export default LoginProvider;
