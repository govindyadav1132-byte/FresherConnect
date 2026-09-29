import { useEffect, useState } from 'react'
import './App.css'

import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import ResumeUpload from './ResumeUpload'
import Results from './Results'
import ResumeHistory from './ResumeHistory'
import Training from './Training'

import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(0)

  useEffect(() => {
    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUser(session.user)
        } else {
          setUser(null)
          setPage('login')
          setProfileCompletion(0)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadProfileCompletion()
    }
  }, [user])

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      await loadUser(session.user)
    }

    setCheckingSession(false)
  }

  async function loadUser(authUser) {
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

    setPage('dashboard')
  }

  async function loadProfileCompletion() {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, college, course, year, skills')
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
      (field) => field && field.trim() !== ''
    ).length

    setProfileCompletion(Math.round((completed / fields.length) * 100))
  }

  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser)
    setPage('dashboard')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setAnalysis(null)
    setProfileCompletion(0)
    setPage('login')
  }

  function handleAnalysisComplete(data) {
    setAnalysis(data)
    setPage('results')
  }

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <div className="app">

      {/* LOGIN */}
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoSignup={() => setPage('signup')}
        />
      )}

      {/* SIGNUP */}
      {page === 'signup' && (
        <Signup
          onSignupSuccess={() => setPage('login')}
          onGoLogin={() => setPage('login')}
        />
      )}

      {/* DASHBOARD */}
      {page === 'dashboard' && user && (
        <>
          <nav className="navbar">
            <div className="logo">
              Fresher<span>Connect</span>
            </div>

            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>

          <main className="dashboard-page">

            <section className="dashboard-hero">
              <div className="dashboard-content">

                <p
                  style={{
                    fontSize: '18px',
                    color: '#64748b',
                    marginBottom: '10px',
                  }}
                >
                  Welcome back, {user.full_name}! 👋
                </p>

                <h1 className="dashboard-title">
                  Your Career <span>Dashboard</span>
                </h1>

                <p>
                  Analyze your resume, identify skill gaps and prepare
                  yourself for your dream career.
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
                    className="hero-btn"
                    onClick={() => setPage('profile')}
                  >
                    👤 My Profile
                  </button>

                  <button
                    className="hero-btn"
                    onClick={() => setPage('upload')}
                  >
                    📄 Upload Resume
                  </button>

                  <button
                    className="hero-btn"
                    onClick={() => setPage('history')}
                  >
                    📚 Resume History
                  </button>

                  <button
                    className="hero-btn"
                    onClick={() => setPage('training')}
                  >
                    🎓 Training & Learning
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
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '25px',
                  boxShadow: '0 8px 25px rgba(15, 23, 42, 0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <h3 style={{ margin: 0 }}>
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
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {profileCompletion === 100 && (
                  <p
                    style={{
                      marginTop: '12px',
                      marginBottom: 0,
                      color: '#16a34a',
                    }}
                  >
                    Your profile is complete! 🎉
                  </p>
                )}
              </div>
            </section>

            {/* CAREER TOOLKIT */}
            <section className="features-section">

              <div className="section-heading">
                <h2>Career Toolkit</h2>
                <p>
                  Everything you need to become internship-ready.
                </p>
              </div>

              <div className="features-grid">

                <div className="feature-card">
                  <div className="feature-icon">📄</div>
                  <h3>Resume Analysis</h3>
                  <p>
                    Analyze your resume against your target role
                    and discover your skill gaps.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🎓</div>
                  <h3>Training & Learning</h3>
                  <p>
                    Learn the skills required for your target
                    internship or fresher role.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">💼</div>
                  <h3>Internships</h3>
                  <p>
                    Discover internship opportunities based on
                    your skills and career goals.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Application Tracking</h3>
                  <p>
                    Track your internship and job applications
                    in one place.
                  </p>
                </div>

              </div>

            </section>

          </main>
        </>
      )}

      {/* PROFILE */}
      {page === 'profile' && user && (
        <Profile
          user={user}
          onBack={() => {
            setPage('dashboard')
            loadProfileCompletion()
          }}
        />
      )}

      {/* RESUME UPLOAD */}
      {page === 'upload' && user && (
        <ResumeUpload
          user={user}
          onBack={() => setPage('dashboard')}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* RESULTS */}
      {page === 'results' && (
        <Results
          analysis={analysis}
          onBack={() => setPage('dashboard')}
        />
      )}

      {/* RESUME HISTORY */}
      {page === 'history' && user && (
        <ResumeHistory
          user={user}
          onBack={() => setPage('dashboard')}
          onViewAnalysis={(data) => {
            setAnalysis(data)
            setPage('history-results')
          }}
        />
      )}

      {/* HISTORY RESULT */}
      {page === 'history-results' && (
        <Results
          analysis={analysis}
          onBack={() => setPage('history')}
        />
      )}

      {/* TRAINING */}
      {page === 'training' && user && (
        <Training
          onBack={() => setPage('dashboard')}
        />
      )}

    </div>
  )
}

export default App