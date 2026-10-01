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
        setMessage(data.error || 'Resume analysis failed.')
        return
      }

      // Save analysis to Supabase
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
            quality_score: data.quality_score,
            resume_quality: data.resume_quality,
          },
        ])

      if (saveError) {
        console.error('Supabase save error:', saveError)
        data.save_warning =
          'Resume analyzed, but could not be saved to your history: ' + saveError.message
      }

      // Show results
      if (onAnalysisComplete) {
        onAnalysisComplete(data)
      }
    } catch (error) {
      console.error('Analysis error:', error)

      setMessage(
        'Could not connect to the backend. Make sure Flask is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="resume-page">

      {/* HEADER */}
      <div className="resume-page-header">

        <button
          type="button"
          className="resume-back-btn"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <h1>Resume Analysis</h1>

          <p>
            Analyze your resume against your target job role.
          </p>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="resume-layout">

        {/* LEFT SIDE */}
        <div className="resume-main-card">

          <div className="resume-card-header">

            <div>
              <h2>Upload Your Resume</h2>

              <p>
                Upload a PDF and select the role you're targeting.
              </p>
            </div>

            <div className="resume-header-icon">
              📄
            </div>

          </div>

          <form onSubmit={handleUpload}>

            {/* TARGET ROLE */}
            <div className="resume-form-group">

              <label>
                Target Job Role
              </label>

              <select
                className="resume-select"
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

              <small>
                Choose the role you want your resume evaluated for.
              </small>

            </div>

            {/* FILE UPLOAD */}
            <div className="resume-form-group">

              <label>
                Resume
              </label>

              <label
                className={`resume-dropzone ${
                  file ? 'resume-dropzone-selected' : ''
                }`}
              >

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  hidden
                />

                {!file ? (
                  <>
                    <div className="upload-big-icon">
                      ↑
                    </div>

                    <h3>
                      Choose your resume
                    </h3>

                    <p>
                      Click here to browse your files
                    </p>

                    <span>
                      PDF only • Maximum 5 MB
                    </span>
                  </>
                ) : (
                  <div className="selected-resume">

                    <div className="pdf-icon">
                      PDF
                    </div>

                    <div className="selected-resume-info">

                      <strong>
                        {file.name}
                      </strong>

                      <span>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>

                    </div>

                    <div className="file-check">
                      ✓
                    </div>

                  </div>
                )}

              </label>

            </div>

            {/* ANALYZE BUTTON */}
            <button
              className="analyze-resume-btn"
              type="submit"
              disabled={!file || !role || loading}
            >

              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <div className="resume-message">
              ⚠ {message}
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}
        <aside className="resume-side-card">

          <h2>
            How it works
          </h2>

          <p className="side-description">
            FresherConnect checks your resume against the
            skills required for your selected role.
          </p>

          <div className="resume-step">

            <div className="step-number">
              1
            </div>

            <div>
              <h3>
                Upload Resume
              </h3>

              <p>
                Upload your latest PDF resume.
              </p>
            </div>

          </div>

          <div className="resume-step">

            <div className="step-number">
              2
            </div>

            <div>
              <h3>
                Select Target Role
              </h3>

              <p>
                Tell us which career path you're targeting.
              </p>
            </div>

          </div>

          <div className="resume-step">

            <div className="step-number">
              3
            </div>

            <div>
              <h3>
                Get Your Score
              </h3>

              <p>
                See your role-specific skill match.
              </p>
            </div>

          </div>

          <div className="resume-step">

            <div className="step-number">
              4
            </div>

            <div>
              <h3>
                Find Skill Gaps
              </h3>

              <p>
                Discover what you should learn next.
              </p>
            </div>

          </div>

          <div className="resume-tip">

            <strong>
              💡 Tip
            </strong>

            <p>
              Keep your resume updated with projects,
              technical skills and relevant experience.
            </p>

          </div>

        </aside>

      </div>

    </div>
  )
}

export default ResumeUpload