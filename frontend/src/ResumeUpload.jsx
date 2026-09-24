import { useState } from 'react'

function ResumeUpload({ onBack }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    setMessage('')
    setResult(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    // PDF only
    if (selectedFile.type !== 'application/pdf') {
      setMessage('Please upload a PDF file only.')
      setFile(null)
      return
    }

    // Maximum 5 MB
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

    setLoading(true)
    setMessage('')
    setResult(null)

    try {
      const formData = new FormData()

      formData.append('resume', file)

      const response = await fetch(
        'http://127.0.0.1:5000/analyze-resume',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      setResult(data)

      setMessage('Resume analyzed successfully!')

    } catch (error) {
      setMessage(
        'Could not connect to the backend. Make sure the Python server is running.'
      )
    }

    setLoading(false)
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

        <h1>Upload Your Resume</h1>

        <p className="auth-subtitle">
          Upload your resume and let FresherConnect analyze your skills.
        </p>

        <form onSubmit={handleUpload}>

          <label>Select Resume</label>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

          {file && (
            <div
              style={{
                marginTop: '15px',
                padding: '12px',
                background: '#eff6ff',
                borderRadius: '8px',
                color: '#172033',
              }}
            >
              <strong>Selected file:</strong>
              <br />
              {file.name}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={!file || loading}
            style={{
              marginTop: '20px',
              opacity: !file || loading ? 0.6 : 1,
              cursor: !file || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Analyzing Resume...'
              : 'Upload Resume →'}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        {result && (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '10px',
              textAlign: 'left',
            }}
          >

            <h3>Resume Analysis</h3>

            <p>
              <strong>File:</strong> {result.filename}
            </p>

            <p>
              <strong>Pages:</strong> {result.pages}
            </p>

            <p>
              <strong>Skills Found:</strong>
            </p>

            {result.skills && result.skills.length > 0 ? (
              <ul>
                {result.skills.map((skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No known skills detected.</p>
            )}

          </div>
        )}

      </div>

    </div>
  )
}

export default ResumeUpload