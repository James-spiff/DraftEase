import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PopupComponent from './components/PopupComponent'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopupComponent />
    <ToastContainer />
  </StrictMode>,
)
