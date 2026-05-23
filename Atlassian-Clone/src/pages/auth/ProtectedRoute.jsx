import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

const ProtectedRoute = () => {
    const {login,setLogin}=useContext(LoginContext);
  return (
    <div>
        {login?(<Outlet/>):(<Navigate to={'/login'} replace />)}
    </div>
  )
}

export default ProtectedRoute