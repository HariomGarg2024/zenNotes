import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
import toast from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
const App = () => {
  return (
    <div data-theme="coffee">
      

      <button className='btn btn-primary'>Click me</button>
      <button className="btn">Button</button>
      <button className="btn btn-neutral">Neutral</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
      <button className="btn btn-accent">Accent</button>
      <button className="btn btn-ghost">Ghost</button>
      <button className="btn btn-link">Link</button>

      <Navbar/>

      <Routes>
      <Route path="/" element = {<HomePage/>} />
      <Route path="/create" element = {<CreatePage/>} />
      <Route path="/note/:id" element = {<NoteDetailPage/>} />
    </Routes>
    </div>
  )
}

export default App