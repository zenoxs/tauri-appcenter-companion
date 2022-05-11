import React from 'react'
import { render } from 'react-dom'
import { App } from './app/App'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import './index.css'

initializeIcons()

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')!
)
