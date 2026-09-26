import React from 'react'
import { createRoot } from 'react-dom/client'
import { PianoGame } from './pages/PianoGame'
import './style.css'

createRoot(document.getElementById('root')!).render(<React.StrictMode><PianoGame /></React.StrictMode>)
