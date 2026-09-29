import { useState } from 'react'
import { supabase } from './supabaseClient'

function ResumeUpload({ user, onBack, onAnalysisComplete }) {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    setMessage('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setMessage('Please upload a PDF file only.')
      setFile(null)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5 MB.')
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage('Please select your resume first.')
      return
    }

    if (!role) {
      setMessage('Please select a target job role.')
      return
    }

    if (!user?.id) {
      setMessage('User session not found. Please login again.')
      return
    }

    setLoading(true)
    setMessage('')

    const formData = new FormData()

    formData.append('resume', file)
    formData.append('role', role)

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/analyze-resume',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.error || 'Resume analysis failed.'
        )
        return
      }

      // =====================================================
      // SAVE ANALYSIS TO SUPABASE
      // =====================================================

      const { error: saveError } = await supabase
        .from('resume_analysis')
        .insert([
          {
            user_id: user.id,

            filename: data.filename,

            role: data.role,

            pages: data.pages,

            skill_score: data.skill_score,

            skills: data.skills,

            missing_skills: data.missing_skills,

            recommendations: data.recommendations,

            // NEW
            quality_score: data.quality_score,

            // NEW
            resume_quality: data.resume_quality,
          },
        ])

      if (saveError) {
        console.error(
          'Supabase save error:',
          saveError
        )

        setMessage(
          'Resume analyzed, but the analysis could not be saved.'
        )

        if (onAnalysisComplete) {
          onAnalysisComplete(data)
        }

        return
      }

      // =====================================================
      // SHOW RESULTS
      // =====================================================

      if (onAnalysisComplete) {
        onAnalysisComplete(data)
      }

    } catch (error) {
      console.error(
        'Analysis error:',
        error
      )

      setMessage(
        'Could not connect to the backend. Make sure Flask is running.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="auth-logo">
          <span>F</span> FresherConnect
        </div>

        <h1>
          Upload Your Resume
        </h1>

        <p className="auth-subtitle">
          Upload your resume and select the job role you want to target.
        </p>

        <form onSubmit={handleUpload}>

          {/* ================================================= */}
          {/* TARGET ROLE */}
          {/* ================================================= */}

          <label>
            Target Job Role
          </label>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setMessage('')
            }}
          >

            <option value="">
              Select a job role
            </option>

            <option value="Frontend Developer">
              Frontend Developer
            </option>

            <option value="Backend Developer">
              Backend Developer
            </option>

            <option value="Full Stack Developer">
              Full Stack Developer
            </option>

            <option value="Python Developer">
              Python Developer
            </option>

            <option value="Java Developer">
              Java Developer
            </option>

            <option value="Data Analyst">
              Data Analyst
            </option>

            <option value="Data Scientist">
              Data Scientist
            </option>

            <option value="Machine Learning Engineer">
              Machine Learning Engineer
            </option>

            <option value="Android Developer">
              Android Developer
            </option>

          </select>


          {/* ================================================= */}
          {/* RESUME FILE */}
          {/* ================================================= */}

          <label>
            Select Resume
          </label>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />


          {/* ================================================= */}
          {/* SELECTED FILE */}
          {/* ================================================= */}

          {file && (

            <div
              style={{
                marginTop: '12px',
                padding: '12px 15px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                color: '#475569',
                fontSize: '14px',
              }}
            >
              📄 {file.name}
            </div>

          )}


          {/* ================================================= */}
          {/* ANALYZE BUTTON */}
          {/* ================================================= */}

          <button
            className="auth-submit"
            type="submit"
            disabled={
              !file ||
              !role ||
              loading
            }
          >
            {loading
              ? 'Analyzing Resume...'
              : 'Analyze Resume →'}
          </button>

        </form>


        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        {message && (

          <p className="auth-message">
            {message}
          </p>

        )}

      </div>

    </div>
  )
}

export default ResumeUpload