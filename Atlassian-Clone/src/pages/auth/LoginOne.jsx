import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';
import { useContext } from 'react';
import googleAuth from '../../utils/api.js';
import axios from 'axios';
const LoginOne = () => {

  const navigate = useNavigate();
  const {login,setLogin}=useContext(LoginContext);
  const {user,setUser}=useContext(LoginContext);
  const handleSignupRedirect = () => {
    navigate("/signup");
  };
  const responseGoogle=async (authResult) => {
    try {
      console.log(authResult);
      if (authResult["code"]) {
        // const response = await googleAuth(authResult.code)
        const response = await axios.get(`http://localhost:5000/auth/google-auth?code=${authResult.code}`);

        const{name,email,profilepic}=response.data.user;
        
        const token =response.data.token;
        const obj={email,name,token,profilepic};
        setUser(obj.name);

        localStorage.setItem('userInfo',JSON.stringify(obj));
        setLogin(true)
        // navigate(`/${name}/dashboard`);
        navigate('/UserDashboard')
      }else{
        console.log(authResult);
        throw new Error(authResult);
        
      }
      console.log(login);
    } catch (error) {
      console.log(`This is the Error ${error}`);
      
    }
  }
  const GoogleLogin=useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow:'auth-code'
  })
  const handleGoogleLogin = () => {
    // You can integrate Google Auth here
    // alert("Google Login clicked!");
    GoogleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <div>
          <label htmlFor="Email" className="block text-gray-600 mb-1">Email</label>
          <input
            type="text"
            name="Email"
            placeholder="Enter Your Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="Password" className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="Password"
            placeholder="Enter Your Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>

        <div className="flex items-center justify-between">
          <hr className="w-full border-t" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="w-full border-t" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-100 transition"
        >
          {/* Optional: Add Google icon */}
          {/* <img src="/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" /> */}
          Login with Google
        </button>

        <div className="text-center pt-2">
          <p className="text-gray-600">Not a registered user?</p>
          <button
            onClick={handleSignupRedirect}
            className="text-blue-500 hover:underline font-medium mt-1"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOne;
