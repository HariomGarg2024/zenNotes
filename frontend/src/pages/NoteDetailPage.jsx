import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Edit2, Trash2, Save, X, Loader2, Calendar } from 'lucide-react'
import RateLimitedUI from '../components/RateLimitedUI.jsx'

const API_URL = 'http://localhost:5001/hariom/notes'

const NoteDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [note, setNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/${id}`)
      setNote(response.data)
      setTitle(response.data.title)
      setContent(response.data.content)
      setIsRateLimited(false)
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else if (error.response?.status === 404) {
        toast.error('Note not found')
        navigate('/')
      } else {
        toast.error('Failed to fetch note')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.put(`${API_URL}/${id}`, {
        title: title.trim(),
        content: content.trim()
      })
      setNote(response.data)
      setIsEditing(false)
      setIsRateLimited(false)
      toast.success('Note updated successfully')
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else {
        toast.error('Failed to update note')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      setIsSubmitting(true)
      await axios.delete(`${API_URL}/${id}`)
      toast.success('Note deleted successfully')
      navigate('/')
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else {
        toast.error('Failed to delete note')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <Loader2 className='size-12 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-base-200'>
      {/* Header */}
      <header className='bg-base-300 border-b border-base-content/10'>
        <div className='mx-auto max-w-4xl p-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='btn btn-ghost gap-2'>
              <ArrowLeft className='size-5' />
              <span>Back</span>
            </Link>
            
            {isEditing ? (
              <h1 className='text-xl font-bold'>Edit Note</h1>
            ) : (
              <h1 className='text-xl font-bold truncate max-w-md'>{note?.title}</h1>
            )}
            
            <div className='flex items-center gap-2'>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className='btn btn-ghost btn-sm gap-1'
                    disabled={isSubmitting}
                  >
                    <X className='size-4' />
                    <span className='hidden sm:inline'>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdate}
                    className='btn btn-primary btn-sm gap-1'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <Save className='size-4' />
                    )}
                    <span className='hidden sm:inline'>Save</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='btn btn-ghost btn-sm gap-1'
                  >
                    <Edit2 className='size-4' />
                    <span className='hidden sm:inline'>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className='btn btn-error btn-sm btn-outline gap-1'
                    disabled={isSubmitting}
                  >
                    <Trash2 className='size-4' />
                    <span className='hidden sm:inline'>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {isRateLimited && <RateLimitedUI />}

      {/* Content */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        {isEditing ? (
          <form onSubmit={handleUpdate} className='card bg-base-100 shadow-lg'>
            <div className='card-body p-6 space-y-6'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-semibold'>Title</span>
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='input input-bordered input-lg text-xl'
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-semibold'>Content</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='textarea textarea-bordered textarea-lg min-h-[400px] text-base leading-relaxed'
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>
        ) : (
          <article className='card bg-base-100 shadow-lg'>
            <div className='card-body p-6 md:p-8'>
              {/* Meta info */}
              <div className='flex items-center gap-2 text-sm text-base-content/50 mb-6 pb-4 border-b border-base-300'>
                <Calendar className='size-4' />
                <span>Created: {note && new Date(note.createdAt).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                {note?.updatedAt !== note?.createdAt && (
                  <>
                    <span className='mx-2'>•</span>
                    <span>Updated: {note && new Date(note.updatedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className='text-3xl md:text-4xl font-bold mb-6'>{note?.title}</h1>

              {/* Content */}
              <div className='prose prose-lg max-w-none'>
                {note?.content.split('\n').map((paragraph, index) => (
                  <p key={index} className='mb-4 text-base-content/80 leading-relaxed'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}

export default NoteDetailPage