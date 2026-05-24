import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Home } from "./pages/Home";
import Jira from "./pages/JiraDashboard/Jira";
import SimpleDragDrop from "./features/SimpleDragDrop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListFeature from "./features/List/ListFeature";
import Signup from "./pages/auth/Signup";
import LoginOne from "./pages/auth/LoginOne";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Navbar from "./components/HomePage/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import LoginProvider from "../Context/LoginContext/LoginProvider";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import FinalDashboard from "./pages/UserDashboard/FinalDashboard";
import ProjectDetails from "./pages/UserDashboard/ProjectDetails";
import JiraDashboard from "./pages/JiraDashboard/JiraDashboard";
import PricingPage from "./pages/PricingPage/PricingPage";
import ToDolist from "./features/ToDolist";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <LoginProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<LoginOne />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<PricingPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/JiraDashboard" element={<JiraDashboard />} />
                <Route path="/ToDoList" element={<ToDolist />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/FinalDashboard" element={<FinalDashboard />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                {/* <Route path="/JiraDashboard" element={<JiraDashboard/>} /> */}
                <Route path="/Jira" element={<Jira />} />
                <Route path="/User/ListFeature" element={<ListFeature />} />
              </Route>
              <Route
                path="*"
                element={
                  <div className="flex h-screen items-center justify-center text-3xl font-bold dark:text-white dark:bg-gray-900 w-full">
                    404 - Page Coming Soon
                  </div>
                }
              />
            </Routes>
          </Router>
        </GoogleOAuthProvider>
        {/* <SimpleDragDrop/> */}
      </LoginProvider>
    </>
  );
}

export default App;
