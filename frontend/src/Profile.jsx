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

    if (!user?.id) {
      setMessage('User session not found. Please login again.')
      return
    }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        college: college.trim(),
        course: course.trim(),
        year: year.trim(),
        skills: skills.trim(),
      })
      .eq('user_id', user.id)

    if (error) {
      setMessage(
        'Could not save profile: ' + error.message
      )
    } else {
      setMessage('Profile updated successfully! ✅')
    }

    setSaving(false)
  }

  // ================= PROFILE COMPLETION =================

  const profileFields = [
    fullName,
    college,
    course,
    year,
    skills,
  ]

  const completedFields = profileFields.filter(
    (field) => field.trim() !== ''
  ).length

  const completionPercentage = Math.round(
    (completedFields / profileFields.length) * 100
  )

  if (loading) {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-logo">
            <span>F</span> FresherConnect
          </div>

          <h2>
            Loading Profile...
          </h2>

        </div>

      </div>
    )
  }

  return (
    <div className="auth-page">

      <div
        className="auth-card"
        style={{
          maxWidth: '600px',
        }}
      >

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>


        {/* LOGO */}

        <div className="auth-logo">
          <span>F</span> FresherConnect
        </div>


        {/* TITLE */}

        <h1>
          My Profile
        </h1>

        <p className="auth-subtitle">
          Complete your profile to help recruiters
          know you better.
        </p>


        {/* PROFILE COMPLETION */}

        <div
          style={{
            marginTop: '25px',
            marginBottom: '30px',
            padding: '20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >

            <strong
              style={{
                color: '#172033',
                fontSize: '16px',
              }}
            >
              Profile Completion
            </strong>

            <strong
              style={{
                color: '#2563eb',
                fontSize: '18px',
              }}
            >
              {completionPercentage}%
            </strong>

          </div>


          {/* PROGRESS BAR */}

          <div
            style={{
              width: '100%',
              height: '10px',
              background: '#e2e8f0',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >

            <div
              style={{
                width: `${completionPercentage}%`,
                height: '100%',
                background: '#2563eb',
                borderRadius: '20px',
                transition: 'width 0.3s ease',
              }}
            />

          </div>


          <p
            style={{
              margin: '10px 0 0',
              color: '#64748b',
              fontSize: '14px',
            }}
          >
            {completionPercentage === 100
              ? 'Your profile is complete! 🎉'
              : `Complete ${profileFields.length - completedFields} more field${
                  profileFields.length - completedFields === 1
                    ? ''
                    : 's'
                } to reach 100%.`
            }
          </p>

        </div>


        {/* FORM */}

        <form onSubmit={handleSave}>

          {/* FULL NAME */}

          <label>
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setMessage('')
            }}
            placeholder="Enter your full name"
          />


          {/* COLLEGE */}

          <label>
            College
          </label>

          <input
            type="text"
            value={college}
            onChange={(e) => {
              setCollege(e.target.value)
              setMessage('')
            }}
            placeholder="Enter your college"
          />


          {/* COURSE */}

          <label>
            Course
          </label>

          <input
            type="text"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value)
              setMessage('')
            }}
            placeholder="Example: BSc Computer Science"
          />


          {/* YEAR */}

          <label>
            Year
          </label>

          <input
            type="text"
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setMessage('')
            }}
            placeholder="Example: Third Year"
          />


          {/* SKILLS */}

          <label>
            Skills
          </label>

          <input
            type="text"
            value={skills}
            onChange={(e) => {
              setSkills(e.target.value)
              setMessage('')
            }}
            placeholder="Example: Java, Python, React, SQL"
          />


          {/* SAVE */}

          <button
            className="auth-submit"
            type="submit"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Profile'}
          </button>

        </form>


        {/* MESSAGE */}

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