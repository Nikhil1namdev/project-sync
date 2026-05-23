import React, { useEffect, useState } from 'react';
import CreateLoginContext from './CreateLoginContext.js';

/**
 * INTERVIEW NOTE: LoginProvider uses the React Context API to broadcast global states.
 * It eliminates the need for "prop drilling" by wrapping the entire component tree (<App />)
 * in the context's `.Provider` component. Any nested element can then fetch or alter user profile,
 * login flags, and JWT authorization tokens using the `useContext` hook.
 */
const LoginProvider = ({ children }) => {
  // Rehydrate login states dynamically from localStorage to prevent loss of state on refresh
  const [User, setUser] = useState(() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        const parsed = JSON.parse(info);
        return parsed.name;
      } catch (e) {
        console.error("Error parsing user info in provider state initialization:", e);
      }
    }
    return null;
  });

  const [login, setLogin] = useState(() => {
    return localStorage.getItem('userInfo') ? true : false;
  });

  const [token, setToken] = useState(() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        const parsed = JSON.parse(info);
        return parsed.token;
      } catch (e) {
        console.error("Error parsing user token in provider state initialization:", e);
      }
    }
    return null;
  });

  return (
    // Broadcast context variables and updates triggers to all nested consumer elements
    <CreateLoginContext.Provider value={{ User, login, token, setLogin, setUser, setToken }}>
      {children}
    </CreateLoginContext.Provider>
  );
};

export default LoginProvider;
