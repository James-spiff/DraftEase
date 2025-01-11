import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import PopupComponent from './components/PopupComponent'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <PopupComponent />
  </StrictMode>,
)
