import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './pages/Home'
import Jira from './pages/JiraDashboard/Jira'
import SimpleDragDrop from './features/SimpleDragDrop'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListFeature from './features/List/ListFeature'
import Signup from './pages/auth/Signup'
import LoginOne from './pages/auth/LoginOne'
import Navbar from './components/HomePage/Navbar'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './pages/auth/ProtectedRoute'
import LoginProvider from '../Context/LoginContext/LoginProvider'
import UserDashboard from './pages/UserDashboard/UserDashboard'
import FinalDashboard from './pages/UserDashboard/FinalDashboard'
import JiraDashboard from './pages/JiraDashboard/JiraDashboard'
import PricingPage from './pages/PricingPage/PricingPage'
import ToDolist from './features/ToDolist'
function App() {

  return (
    <>
    <LoginProvider>
     <GoogleOAuthProvider clientId="295710850192-us1jv41mns6mhknr0tp95qdcbnlrbl77.apps.googleusercontent.com">

    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Login' element={<LoginOne/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path="/PricingPage" element={<PricingPage/>} />

        <Route element={<ProtectedRoute/>}>   
        <Route path="/JiraDashboard" element={<JiraDashboard/>} />
        <Route path='/ToDoList' element={<ToDolist/>} />
        <Route path='/UserDashboard' element={<UserDashboard/>} />
        <Route path='/FinalDashboard' element={<FinalDashboard/>} />
        {/* <Route path="/JiraDashboard" element={<JiraDashboard/>} /> */}
              <Route path='/Jira' element={<Jira/>}/>
              <Route path='/User/ListFeature' element={<ListFeature/>}/>
      
        </Route>
        </Routes>
     
    </Router>
     </GoogleOAuthProvider>
     {/* <SimpleDragDrop/> */}
     </LoginProvider>
    </>
  )
}

export default App
