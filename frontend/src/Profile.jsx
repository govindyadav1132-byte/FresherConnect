import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

function Profile({ user, onBack }) {
  const [fullName, setFullName] = useState('')
  const [college, setCollege] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [skills, setSkills] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, college, course, year, skills')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.log('Profile loading error:', error.message)
    } else if (data) {
      setFullName(data.full_name || '')
      setCollege(data.college || '')
      setCourse(data.course || '')
      setYear(data.year || '')
      setSkills(data.skills || '')
    }

    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        college: college,
        course: course,
        year: year,
        skills: skills,
      })
      .eq('user_id', user.id)

    if (error) {
      setMessage('Could not save profile: ' + error.message)
    } else {
      setMessage('Profile updated successfully! ✅')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="auth-logo">
          <span>F</span> FresherConnect
        </div>

        <h1>My Profile</h1>

        <p className="auth-subtitle">
          Complete your profile to help recruiters know you better.
        </p>

        <form onSubmit={handleSave}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>College</label>

          <input
            type="text"
            placeholder="Enter your college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />

          <label>Course</label>

          <input
            type="text"
            placeholder="Example: BSc Computer Science"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <label>Year</label>

          <input
            type="text"
            placeholder="Example: TYCS"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <label>Skills</label>

          <input
            type="text"
            placeholder="Example: Java, Python, React"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <button
            className="auth-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}

export default Profile