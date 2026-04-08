import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import RateLimitedUI from '../components/RateLimitedUI.jsx'

const API_URL = 'http://localhost:5001/hariom/notes'

const CreatePage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(API_URL, { title: title.trim(), content: content.trim() })
      toast.success('Note created successfully')
      navigate('/')
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      } else {
        toast.error('Failed to create note')
      }
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className='text-xl font-bold'>Create Note</h1>
            <div className='w-20'></div>
          </div>
        </div>
      </header>

      {isRateLimited && <RateLimitedUI />}

      {/* Form */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <form onSubmit={handleSubmit} className='card bg-base-100 shadow-lg'>
          <div className='card-body p-6 space-y-6'>
            {/* Title Input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-semibold'>Title</span>
              </label>
              <input
                type='text'
                placeholder='Enter note title...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='input input-bordered input-lg text-xl'
                disabled={isSubmitting}
              />
            </div>

            {/* Content Input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-semibold'>Content</span>
              </label>
              <textarea
                placeholder='Write your note here...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='textarea textarea-bordered textarea-lg min-h-[300px] text-base leading-relaxed'
                disabled={isSubmitting}
              />
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-3 pt-4'>
              <Link to='/' className='btn btn-ghost'>
                Cancel
              </Link>
              <button
                type='submit'
                className='btn btn-primary gap-2'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='size-5 animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className='size-5' />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreatePage