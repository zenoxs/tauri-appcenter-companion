import React from 'react'
import { render } from 'react-dom'
import { App } from './app/App'
import { BrowserRouter } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import './index.css'

initializeIcons()

render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')!
)
