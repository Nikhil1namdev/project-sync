import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * INTERVIEW NOTE: ProtectedRoute is a higher-order route guardian.
 * It consumes `LoginContext` to inspect whether the client is authenticated (`login` === true).
 * - If true: Renders the nested routes via `<Outlet />`.
 * - If false: Dynamically redirects the browser to `/login` using the `<Navigate />` element (with `replace` to purge history).
 */
const ProtectedRoute = () => {
    // 1. Consume the global authentication state from LoginContext
    const {login, setLogin} = useContext(LoginContext);
    
    return (
        <div>
            {/* 2. Route Guarding check: if login is true, render child routes; else redirect */}
            {login ? (<Outlet/>) : (<Navigate to={'/login'} replace />)}
        </div>
    )
}

export default ProtectedRoute