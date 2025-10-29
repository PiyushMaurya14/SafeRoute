import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapComponent from './components/MapComponent/MapComponent'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/home/home'
import SOS from './components/SOS'





function App() {

  return (
    <>
      <Home />
      {/* small left-edge SOS overlay */}
      <SOS contacts={['+15551234567', '+15559876543']} />
    </>
  )
}

export default App