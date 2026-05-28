import React from 'react'
import Navbar from '../components/HomePage/Navbar'
import Hero from '../components/HeroSection/Hero'
import WelcomeBackPopup from '../components/HomePage/WelcomeBackPopup'

export const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* Floating welcome-back card — shown only for logged-in users */}
      <WelcomeBackPopup />
    </div>
  )
}
