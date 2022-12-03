import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'
import Main from './src/public/main'

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('react-app'))
  root.render(
    <BrowserRouter>
      <Route path="/" component={Main} />
    </BrowserRouter>
  )
})
