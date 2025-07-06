import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Body from './components/LandingPage/Body.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Dashboard from './components/Dashboard/Body/Dashboard.jsx'
import InnerDashboard from './components/InnerDashboard/InnerDashboard.jsx'
import { ExpandableCardDemo } from './components/Flash Card/flashCard.jsx'
import Contact from './components/ContactPage/contact.jsx'
import FlashCardApp from './components/Flash Card 2/FlashCardApp.jsx'




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Body />} />
      <Route path='user/'>
        <Route path='Login' element={<Login />} />
        <Route path='Register' element={<Register />} />
      </Route>
      <Route off path='Dashboard'>
        <Route index element={<Dashboard />} />
        <Route path='Voxify' element={<InnerDashboard />} />
      </Route>
    <Route path='/flashCard' element={<ExpandableCardDemo />}></Route>
    {/* <Route path='/Contact' element={<Contact/>}></Route> */}
    {/* <Route path='/flashCard' element={<FlashCardApp/>}></Route> */}
    </Route>

  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)