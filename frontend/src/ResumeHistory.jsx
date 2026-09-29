import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function ResumeHistory({
  user,
  onBack,
  onViewAnalysis,
}) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // =====================================================
  // LOAD RESUME HISTORY
  // =====================================================

  useEffect(() => {
    loadHistory()
  }, [user])

  const loadHistory = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('resume_analysis')
      .select(`
        id,
        filename,
        role,
        pages,
        skill_score,
        quality_score,
        resume_quality,
        skills,
        missing_skills,
        recommendations,
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(
        'History loading error:',
        error
      )

      setMessage(
        'Could not load your resume history.'
      )

      setHistory([])
    } else {
      setHistory(data || [])
    }

    setLoading(false)
  }

  // =====================================================
  // OPEN FULL ANALYSIS
  // =====================================================

  const openAnalysis = (item) => {
    const analysisData = {
      message: 'Resume analyzed successfully!',

      filename: item.filename,

      pages: item.pages,

      role: item.role,

      skills: item.skills || [],

      missing_skills:
        item.missing_skills || [],

      skill_score:
        item.skill_score ?? 0,

      recommendations:
        item.recommendations || [],

      // NEW
      quality_score:
        item.quality_score ?? 0,

      // NEW
      resume_quality:
        item.resume_quality || null,

      required_skills: [
        ...(item.skills || []),
        ...(item.missing_skills || []),
      ],
    }

    onViewAnalysis(analysisData)
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Unknown date'
    }

    return new Date(dateString).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-logo">
            <span>F</span> FresherConnect
          </div>

          <h2>
            Loading Resume History...
          </h2>

        </div>

      </div>
    )
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="navbar">

        <div className="logo">
          <span>F</span> FresherConnect
        </div>

        <div className="nav-links">

          <button
            className="login-btn"
            onClick={onBack}
            style={{
              padding: '12px 22px',
              border: '1px solid #2563eb',
              borderRadius: '9px',
            }}
          >
            ← Back to Dashboard
          </button>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="dashboard-hero">

        <div className="dashboard-content">

          <h1 className="dashboard-title">
            Resume <span>History</span>
          </h1>

          <p>
            View your previous resume analyses,
            scores, skill gaps and recommendations.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* HISTORY */}
      {/* ================================================= */}

      <section className="features-section">

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >

          {/* ================================================= */}
          {/* ERROR / MESSAGE */}
          {/* ================================================= */}

          {message && (

            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '15px 18px',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              {message}
            </div>

          )}


          {/* ================================================= */}
          {/* NO HISTORY */}
          {/* ================================================= */}

          {history.length === 0 && !message && (

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '40px 25px',
                textAlign: 'center',
              }}
            >

              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                }}
              >
                📄
              </div>

              <h2
                style={{
                  margin: '0 0 10px',
                  color: '#172033',
                }}
              >
                No Resume History Yet
              </h2>

              <p
                style={{
                  color: '#64748b',
                  marginBottom: '25px',
                }}
              >
                Upload your first resume to see
                your analysis history here.
              </p>

              <button
                className="hero-btn"
                onClick={onBack}
              >
                ← Back to Dashboard
              </button>

            </div>

          )}


          {/* ================================================= */}
          {/* HISTORY CARDS */}
          {/* ================================================= */}

          <div
            style={{
              display: 'grid',
              gap: '20px',
            }}
          >

            {history.map((item) => {

              const skills =
                item.skills || []

              const missingSkills =
                item.missing_skills || []

              const qualityScore =
                item.quality_score

              return (

                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow:
                      '0 4px 15px rgba(15, 23, 42, 0.05)',
                  }}
                >

                  {/* ========================================= */}
                  {/* CARD HEADER */}
                  {/* ========================================= */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '20px',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                    }}
                  >

                    <div>

                      <h2
                        style={{
                          margin: '0 0 7px',
                          color: '#172033',
                        }}
                      >
                        {item.role}
                      </h2>

                      <p
                        style={{
                          margin: 0,
                          color: '#64748b',
                          fontSize: '14px',
                        }}
                      >
                        📄 {item.filename}
                      </p>

                    </div>


                    {/* SCORE AREA */}

                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >

                      {/* ROLE MATCH */}

                      <div
                        style={{
                          minWidth: '115px',
                          textAlign: 'center',
                          padding: '12px 16px',
                          background: '#eff6ff',
                          borderRadius: '12px',
                        }}
                      >

                        <div
                          style={{
                            fontSize: '25px',
                            fontWeight: '700',
                            color: '#2563eb',
                          }}
                        >
                          {item.skill_score ?? 0}%
                        </div>

                        <div
                          style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginTop: '2px',
                          }}
                        >
                          Role Match
                        </div>

                      </div>


                      {/* RESUME QUALITY */}

                      <div
                        style={{
                          minWidth: '115px',
                          textAlign: 'center',
                          padding: '12px 16px',
                          background: '#f0fdf4',
                          borderRadius: '12px',
                        }}
                      >

                        <div
                          style={{
                            fontSize: '25px',
                            fontWeight: '700',
                            color: '#16a34a',
                          }}
                        >
                          {qualityScore !== null &&
                          qualityScore !== undefined
                            ? `${qualityScore}%`
                            : '—'}
                        </div>

                        <div
                          style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginTop: '2px',
                          }}
                        >
                          Resume Quality
                        </div>

                      </div>

                    </div>

                  </div>


                  {/* ========================================= */}
                  {/* BASIC INFORMATION */}
                  {/* ========================================= */}

                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                    }}
                  >

                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '14px',
                      }}
                    >
                      📑 {item.pages} page
                      {item.pages === 1 ? '' : 's'}
                    </span>

                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '14px',
                      }}
                    >
                      📅 {formatDate(item.created_at)}
                    </span>

                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '14px',
                      }}
                    >
                      🛠️ {skills.length} skills found
                    </span>

                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '14px',
                      }}
                    >
                      ⚠️ {missingSkills.length} skill gaps
                    </span>

                  </div>


                  {/* ========================================= */}
                  {/* SKILLS */}
                  {/* ========================================= */}

                  {skills.length > 0 && (

                    <div
                      style={{
                        marginBottom: '15px',
                      }}
                    >

                      <strong
                        style={{
                          display: 'block',
                          color: '#172033',
                          marginBottom: '9px',
                        }}
                      >
                        Skills Found
                      </strong>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >

                        {skills.map(
                          (skill, index) => (

                            <span
                              key={index}
                              style={{
                                padding:
                                  '6px 12px',
                                background:
                                  '#eff6ff',
                                color:
                                  '#2563eb',
                                borderRadius:
                                  '20px',
                                fontSize:
                                  '13px',
                                fontWeight:
                                  '600',
                              }}
                            >
                              ✓ {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* ========================================= */}
                  {/* SKILL GAPS */}
                  {/* ========================================= */}

                  {missingSkills.length > 0 && (

                    <div
                      style={{
                        marginBottom: '20px',
                      }}
                    >

                      <strong
                        style={{
                          display: 'block',
                          color: '#172033',
                          marginBottom: '9px',
                        }}
                      >
                        Skill Gaps
                      </strong>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >

                        {missingSkills.map(
                          (skill, index) => (

                            <span
                              key={index}
                              style={{
                                padding:
                                  '6px 12px',
                                background:
                                  '#fef2f2',
                                color:
                                  '#dc2626',
                                borderRadius:
                                  '20px',
                                fontSize:
                                  '13px',
                                fontWeight:
                                  '600',
                              }}
                            >
                              ⚠ {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* ========================================= */}
                  {/* VIEW ANALYSIS */}
                  {/* ========================================= */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '10px',
                    }}
                  >

                    <button
                      className="hero-btn"
                      onClick={() =>
                        openAnalysis(item)
                      }
                      style={{
                        padding:
                          '11px 20px',
                        fontSize: '14px',
                      }}
                    >
                      View Full Analysis →
                    </button>

                  </div>

                </div>

              )
            })}

          </div>

        </div>

      </section>

    </div>
  )
}

export default ResumeHistory