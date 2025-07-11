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
import QuizPage from './components/Quiz/Quiz.jsx'
import Pdf from './components/Pdf/Pdf.jsx'
import Contact from './components/ContactUs/Contact.jsx'
import { ExpandableCardDemo } from './components/FlashCard/FlashCard.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Body />} />
      <Route path='contact' element={<Contact />} />
      <Route path='user/'>
        <Route path='Login' element={<Login />} />
        <Route path='Register' element={<Register />} />
      </Route>
      <Route path='Dashboard'>
        <Route index element={<Dashboard />} />
        <Route path='Voxify' element={<InnerDashboard />} />
        <Route path='Quiz' element={<QuizPage />} />
        <Route path='pdf' element={<Pdf />} />
        <Route path='FlashCard' element={<ExpandableCardDemo />} />
      </Route>
    </Route>

  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)