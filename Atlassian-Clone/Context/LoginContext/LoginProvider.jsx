import React, { useEffect, useState } from 'react';
import CreateLoginContext from './CreateLoginContext.js';

const LoginProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState(null);

  // ⬇️ Rehydrate login state from localStorage
 useEffect(() => {
  // const storedUser = localStorage.getItem('userInfo');
  // if (storedUser) {
  //   try {
  //     const parsedUser = JSON.parse(storedUser);
  //     if (parsedUser && parsedUser.token) {
  //       setUser(parsedUser.name); // ✅ use `name` directly
  //       setLogin(true);
  //       setToken(parsedUser.token);
  //     }
  //   } catch (err) {
  //     console.error('Failed to parse userInfo from localStorage:', err);
  //     localStorage.removeItem('userInfo'); // clean up corrupted data
  //   }
  // }
}, []);


  return (
    <CreateLoginContext.Provider value={{ User, login, token, setLogin, setUser, setToken }}>
      {children}
    </CreateLoginContext.Provider>
  );
};

export default LoginProvider;
