import React, { useEffect, useState } from 'react';
import CreateLoginContext from './CreateLoginContext.js';

/**
 * INTERVIEW NOTE: LoginProvider uses the React Context API to broadcast global states.
 * It eliminates the need for "prop drilling" by wrapping the entire component tree (<App />)
 * in the context's `.Provider` component. Any nested element can then fetch or alter user profile,
 * login flags, and JWT authorization tokens using the `useContext` hook.
 */
const LoginProvider = ({ children }) => {
  // Global React States for dynamic UI updates across components
  const [User, setUser] = useState(null);       // Active user's name
  const [login, setLogin] = useState(false);    // Authentication status boolean flag
  const [token, setToken] = useState(null);    // Signed JWT authorization token

  // ⬇️ Rehydrate login state from localStorage (commented out in current project structure)
  useEffect(() => {
    // If enabled, this acts as a dynamic browser session rehydrator.
    // It checks if local storage contains a valid user token, then populates state
    // so the user remains authenticated on page refresh instead of logging out.
  }, []);

  return (
    // Broadcast context variables and updates triggers to all nested consumer elements
    <CreateLoginContext.Provider value={{ User, login, token, setLogin, setUser, setToken }}>
      {children}
    </CreateLoginContext.Provider>
  );
};

export default LoginProvider;
