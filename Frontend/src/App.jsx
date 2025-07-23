import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Body from './components/LandingPage/Body'
import DashHeader from './components/Dashboard/Header/DashHeader'
import Dashboard from './components/Dashboard/Body/Dashboard'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import InnerDashboard from './components/InnerDashboard/InnerDashboard'
import Pdf from './components/Pdf/Pdf'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Header />
      <Body />
      <Footer /> */}
      {/* <DashHeader /> */}
      {/* <Dashboard /> */}
      {/* <Login /> */}
      {/* <InnerDashboard />  */}
    </div>

  )
}

export default App
