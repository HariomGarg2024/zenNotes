import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/create" element={<CreatePage/>} />
        <Route path="/note/:id" element={<NoteDetailPage/>} />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App