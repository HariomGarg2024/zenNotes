import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FileText, Search, Trash2, Loader2 } from 'lucide-react'
import RateLimitedUI from '../components/RateLimitedUI.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:5001/hariom/notes'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      setNotes(response.data)
      setIsRateLimited(false)
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else {
        toast.error('Failed to fetch notes')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      await axios.delete(`${API_URL}/${id}`)
      setNotes(notes.filter(note => note._id !== id))
      toast.success('Note deleted successfully')
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else {
        toast.error('Failed to delete note')
      }
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      
      {isRateLimited && <RateLimitedUI />}
      
      <main className='max-w-6xl mx-auto px-4 py-8'>
        {/* Search Bar */}
        <div className='mb-8'>
          <div className='relative max-w-md mx-auto'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/50' />
            <input
              type='text'
              placeholder='Search notes...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='input input-bordered w-full pl-10'
            />
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='size-10 animate-spin text-primary' />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className='text-center py-20'>
            <FileText className='size-16 mx-auto text-base-content/30 mb-4' />
            <h3 className='text-xl font-semibold text-base-content/70 mb-2'>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className='text-base-content/50 mb-6'>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Create your first note to get started'}
            </p>
            {!searchQuery && (
              <Link to='/create' className='btn btn-primary'>
                Create Note
              </Link>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredNotes.map((note) => (
              <Link
                key={note._id}
                to={`/note/${note._id}`}
                className='card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-300 group'
              >
                <div className='card-body p-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <h3 className='card-title text-lg font-bold line-clamp-1 flex-1'>
                      {note.title}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(note._id, e)}
                      className='btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-error'
                      title='Delete note'
                    >
                      <Trash2 className='size-4' />
                    </button>
                  </div>
                  <p className='text-base-content/70 line-clamp-3 mt-2'>
                    {note.content}
                  </p>
                  <div className='text-xs text-base-content/40 mt-4'>
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage