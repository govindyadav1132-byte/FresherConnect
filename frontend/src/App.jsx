import { useEffect, useState } from 'react'
import './App.css'

import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import ResumeUpload from './ResumeUpload'
import Results from './Results'
import ResumeHistory from './ResumeHistory'
import Training from './Training'
import Internships from './Internships'
import ApplicationTracker from './ApplicationTracker'
import ResumeBuilder from './ResumeBuilder'

import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(0)

  // ================= SESSION =================

  useEffect(() => {
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          loadUser(session.user, event === 'SIGNED_IN')
        } else {
          setUser(null)
          setPage('login')
          setProfileCompletion(0)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // ================= PROFILE COMPLETION =================

  useEffect(() => {
    if (user?.id) {
      loadProfileCompletion()
    }
  }, [user])

  // ================= CHECK SESSION =================

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      await loadUser(session.user, true)
    }

    setCheckingSession(false)
  }

  // ================= LOAD USER =================

  async function loadUser(authUser, shouldRedirectToDashboard = false) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', authUser.id)
      .single()

    setUser({
      id: authUser.id,
      full_name:
        profile?.full_name ||
        authUser.user_metadata?.full_name ||
        'User',
    })

    if (shouldRedirectToDashboard) {
      setPage((prevPage) =>
        prevPage === 'login' || prevPage === 'signup'
          ? 'dashboard'
          : prevPage
      )
    }
  }

  // ================= PROFILE COMPLETION =================

  async function loadProfileCompletion() {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'full_name, college, course, year, skills'
      )
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      setProfileCompletion(0)
      return
    }

    const fields = [
      data.full_name,
      data.college,
      data.course,
      data.year,
      data.skills,
    ]

    const completed = fields.filter(
      (field) =>
        field &&
        field.toString().trim() !== ''
    ).length

    setProfileCompletion(
      Math.round(
        (completed / fields.length) * 100
      )
    )
  }

  // ================= LOGIN =================

  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser)
    setPage('dashboard')
  }

  // ================= LOGOUT =================

  async function handleLogout() {
    await supabase.auth.signOut()

    setUser(null)
    setAnalysis(null)
    setProfileCompletion(0)
    setPage('login')
  }

  // ================= ANALYSIS =================

  function handleAnalysisComplete(data) {
    setAnalysis(data)
    setPage('results')
  }

  // ================= LOADING =================

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Loading...
      </div>
    )
  }

  // ================= MAIN =================

  return (
    <>
      <div className="app">

        {/* ================= LOGIN ================= */}

        {page === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSignup={() => setPage('signup')}
          />
        )}

        {/* ================= SIGNUP ================= */}

        {page === 'signup' && (
          <Signup
            onBack={() => setPage('login')}
            onLogin={() => setPage('login')}
          />
        )}

        {/* ================= DASHBOARD ================= */}

        {page === 'dashboard' && user && (
          <>
            <nav className="navbar">

              <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setPage('dashboard')}>
                Fresher<span>Connect</span>
              </div>

              <div className="nav-links">
                <button
                  type="button"
                  className={`nav-link ${page === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setPage('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => setPage('upload')}
                >
                  Analyze Resume
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => setPage('builder')}
                >
                  Resume Builder
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => setPage('training')}
                >
                  Training & OJT
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => setPage('internships')}
                >
                  Internships
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => setPage('applications')}
                >
                  Applications
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="login-btn"
                  onClick={() => setPage('profile')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>👤</span> Profile
                </button>

                <button
                  type="button"
                  className="login-btn"
                  onClick={handleLogout}
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  Logout
                </button>
              </div>

            </nav>

            <main className="dashboard-page">

              {/* HERO */}

              <section className="dashboard-hero">

                <div className="dashboard-content">

                  <p
                    style={{
                      fontSize: '18px',
                      color: '#64748b',
                      marginBottom: '10px',
                    }}
                  >
                    Welcome back,{' '}
                    {user.full_name}! 👋
                  </p>

                  <h1 className="dashboard-title">
                    Your Career{' '}
                    <span>Dashboard</span>
                  </h1>

                  <p>
                    Analyze your resume,
                    identify skill gaps and
                    prepare yourself for your
                    dream career.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginTop: '28px',
                    }}
                  >

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('upload')
                      }
                    >
                      📄 Analyze Resume
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('builder')
                      }
                    >
                      📝 Resume Builder
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('training')
                      }
                    >
                      🎓 Training & OJT
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('internships')
                      }
                    >
                      💼 Internships & Jobs
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('applications')
                      }
                    >
                      📊 Application Tracker
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('history')
                      }
                    >
                      📚 Resume History
                    </button>

                    <button
                      type="button"
                      className="hero-btn"
                      onClick={() =>
                        setPage('profile')
                      }
                      style={{
                        background: '#ffffff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      👤 My Profile
                    </button>

                  </div>

                </div>

              </section>

              {/* PROFILE COMPLETION */}

              <section
                style={{
                  maxWidth: '1100px',
                  margin: '0 auto',
                  padding: '20px',
                }}
              >

                <div
                  style={{
                    background: '#ffffff',
                    border:
                      '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow:
                      '0 8px 25px rgba(15, 23, 42, 0.06)',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      Profile Completion
                    </h3>

                    <strong
                      style={{
                        color: '#2563eb',
                        fontSize: '20px',
                      }}
                    >
                      {profileCompletion}%
                    </strong>

                  </div>

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
                        width: `${profileCompletion}%`,
                        height: '100%',
                        background: '#2563eb',
                        borderRadius: '20px',
                        transition:
                          'width 0.3s ease',
                      }}
                    />

                  </div>

                  {profileCompletion ===
                    100 && (
                    <p
                      style={{
                        marginTop: '12px',
                        marginBottom: 0,
                        color: '#16a34a',
                      }}
                    >
                      Your profile is
                      complete! 🎉
                    </p>
                  )}

                </div>

              </section>

              {/* CAREER TOOLKIT */}

              <section className="features-section">

                <div className="section-heading">

                  <h2>
                    Career Toolkit
                  </h2>

                  <p>
                    Everything you need to
                    become internship-ready.
                  </p>

                </div>

                <div className="features-grid">

                  <div
                    className="feature-card"
                    onClick={() => setPage('upload')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon">
                      📄
                    </div>
                    <h3>
                      Resume Analysis
                    </h3>
                    <p>
                      Analyze your resume against your target role, detect demonstrated vs missing skills, and get an explainable match score.
                    </p>
                    <span style={{ marginTop: 'auto', paddingTop: '14px', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>
                      Analyze Resume →
                    </span>
                  </div>

                  <div
                    className="feature-card"
                    onClick={() => setPage('builder')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon">
                      📝
                    </div>
                    <h3>
                      Resume Builder
                    </h3>
                    <p>
                      Create and refine recruiter-ready resumes using professional templates with real-time preview and PDF export.
                    </p>
                    <span style={{ marginTop: 'auto', paddingTop: '14px', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>
                      Build Resume →
                    </span>
                  </div>

                  <div
                    className="feature-card"
                    onClick={() => setPage('training')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon">
                      🎓
                    </div>
                    <h3>
                      Training & Practical OJT
                    </h3>
                    <p>
                      Master required skills through curated lessons, quizzes, hands-on practical tasks, and verify OJT evidence.
                    </p>
                    <span style={{ marginTop: 'auto', paddingTop: '14px', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>
                      Start Learning →
                    </span>
                  </div>

                  <div
                    className="feature-card"
                    onClick={() => setPage('internships')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon">
                      💼
                    </div>
                    <h3>
                      Internships & Jobs
                    </h3>
                    <p>
                      Explore internship-first opportunities and entry-level fresher jobs with eligibility filters and career readiness indicators.
                    </p>
                    <span style={{ marginTop: 'auto', paddingTop: '14px', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>
                      Browse Openings →
                    </span>
                  </div>

                  <div
                    className="feature-card"
                    onClick={() => setPage('applications')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon">
                      📊
                    </div>
                    <h3>
                      Application Tracking
                    </h3>
                    <p>
                      Track application statuses (Saved, Applied, Interview, Offered), log notes, and monitor your career pipeline.
                    </p>
                    <span style={{ marginTop: 'auto', paddingTop: '14px', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>
                      View Applications →
                    </span>
                  </div>

                </div>

              </section>

            </main>
          </>
        )}

        {/* ================= PROFILE ================= */}

        {page === 'profile' && user && (
          <Profile
            user={user}
            onBack={() => {
              setPage('dashboard')
              loadProfileCompletion()
            }}
          />
        )}

        {/* ================= RESUME UPLOAD ================= */}

        {page === 'upload' && user && (
          <ResumeUpload
            user={user}
            onBack={() =>
              setPage('dashboard')
            }
            onAnalysisComplete={
              handleAnalysisComplete
            }
          />
        )}

        {/* ================= RESULTS ================= */}

        {page === 'results' && (
          <Results
            analysis={analysis}
            onBack={() =>
              setPage('dashboard')
            }
            backLabel="Back to Dashboard"
            onNavigateTraining={() => setPage('training')}
            onNavigateInternships={() => setPage('internships')}
            onNavigateBuilder={() => setPage('builder')}
          />
        )}

        {/* ================= RESUME HISTORY ================= */}

        {page === 'history' && user && (
          <ResumeHistory
            user={user}
            onBack={() =>
              setPage('dashboard')
            }
            onViewAnalysis={(data) => {
              setAnalysis(data)
              setPage('history-results')
            }}
          />
        )}

        {/* ================= HISTORY RESULTS ================= */}

        {page === 'history-results' && (
          <Results
            analysis={analysis}
            onBack={() =>
              setPage('history')
            }
            backLabel="Back to History"
            onNavigateTraining={() => setPage('training')}
            onNavigateInternships={() => setPage('internships')}
            onNavigateBuilder={() => setPage('builder')}
          />
        )}

        {/* ================= TRAINING ================= */}

        {page === 'training' && user && (
          <Training
            user={user}
            onBack={() =>
              setPage('dashboard')
            }
          />
        )}

        {/* ================= INTERNSHIPS & JOBS ================= */}

        {page === 'internships' && user && (
          <Internships
            user={user}
            userSkills={analysis?.skills || []}
            onBack={() => setPage('dashboard')}
            onApplyOpportunity={(newApp) => {
              try {
                const current = JSON.parse(localStorage.getItem('fc_applications_list') || '[]')
                localStorage.setItem('fc_applications_list', JSON.stringify([newApp, ...current]))
              } catch {
                // ignore
              }
            }}
          />
        )}

        {/* ================= APPLICATION TRACKER ================= */}

        {page === 'applications' && user && (
          <ApplicationTracker
            user={user}
            onBack={() => setPage('dashboard')}
            onNavigateToOpportunities={() => setPage('internships')}
          />
        )}

        {/* ================= RESUME BUILDER ================= */}

        {page === 'builder' && user && (
          <ResumeBuilder
            user={user}
            onBack={() => setPage('dashboard')}
          />
        )}

      </div>
    </>
  )
}

export default App