import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'
import AdminMain from './src/admin/main'

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('admin-app'))
  root.render(
    <BrowserRouter>
      <Route path="/admin" component={AdminMain} />
    </BrowserRouter>
  )
})
