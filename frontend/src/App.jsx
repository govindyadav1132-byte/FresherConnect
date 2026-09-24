import './App.css'
import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import ResumeUpload from './ResumeUpload'
import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  // =========================
  // Login Page
  // =========================
  if (page === 'login') {
    return (
      <Login
        onBack={() => setPage('home')}
        onSignup={() => setPage('signup')}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser)
          setPage('dashboard')
        }}
      />
    )
  }

  // =========================
  // Signup Page
  // =========================
  if (page === 'signup') {
    return (
      <Signup
        onBack={() => setPage('home')}
        onLogin={() => setPage('login')}
      />
    )
  }

  // =========================
  // Profile Page
  // =========================
  if (page === 'profile') {
    return (
      <Profile
        user={user}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  // =========================
  // Resume Upload Page
  // =========================
  if (page === 'resume') {
    return (
      <ResumeUpload
        onBack={() => setPage('dashboard')}
      />
    )
  }

  // =========================
  // Dashboard
  // =========================
  if (page === 'dashboard') {
    return (
      <div className="app">

        {/* Dashboard Navbar */}
        <nav className="navbar">

          <div className="logo">
            <span>F</span> FresherConnect
          </div>

          <div className="nav-links">

            <button
              className="login-btn"
              onClick={() => setPage('profile')}
            >
              My Profile
            </button>

            <span>
              Welcome, {user?.full_name || 'User'}!
            </span>

            <button
              className="login-btn"
              onClick={async () => {
                await supabase.auth.signOut()
                setUser(null)
                setPage('home')
              }}
            >
              Logout
            </button>

          </div>

        </nav>

        {/* Dashboard Hero */}
        <section className="hero-section">

          <div className="hero-content">

            <p className="tagline">
              WELCOME BACK
            </p>

            <h1 className="dashboard-title">
              Hello, <span>{user?.full_name || 'User'}!</span>
            </h1>

            <p className="hero-text">
              Welcome to your FresherConnect dashboard. Your career journey
              starts here.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() => setPage('resume')}
              >
                Upload Resume →
              </button>

              <button
                className="secondary-btn"
                onClick={() => setPage('profile')}
              >
                My Profile
              </button>

            </div>

          </div>

          <div className="hero-card">

            <div className="card-icon">
              📄
            </div>

            <h2>
              Analyze Your Resume
            </h2>

            <p>
              Upload your resume to discover your skills and improve your
              career opportunities.
            </p>

          </div>

        </section>

        {/* Dashboard Features */}
        <section className="features-section">

          <p className="section-label">
            YOUR CAREER JOURNEY
          </p>

          <h2>
            Build Your Career
          </h2>

          <div className="features">

            <div className="feature-card">

              <div className="feature-icon">
                📄
              </div>

              <h3>
                Resume Analysis
              </h3>

              <p>
                Upload your resume and get insights about your skills and
                career profile.
              </p>

              <button
                className="primary-btn"
                onClick={() => setPage('resume')}
              >
                Upload Resume
              </button>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                👤
              </div>

              <h3>
                Student Profile
              </h3>

              <p>
                Keep your college, course, year and skills information
                updated.
              </p>

              <button
                className="primary-btn"
                onClick={() => setPage('profile')}
              >
                My Profile
              </button>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                💼
              </div>

              <h3>
                Find Opportunities
              </h3>

              <p>
                Discover internships and jobs designed for freshers.
              </p>

            </div>

          </div>

        </section>

      </div>
    )
  }

  // =========================
  // Home Page
  // =========================
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <span>F</span> FresherConnect
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

          <button
            className="login-btn"
            onClick={() => setPage('login')}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => setPage('signup')}
          >
            Sign Up
          </button>

        </div>

      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-content">

          <p className="tagline">
            WELCOME TO FRESHERCONNECT
          </p>

          <h1>
            Start Your Career
            <br />
            <span>With Confidence.</span>
          </h1>

          <p className="hero-text">
            FresherConnect helps students and fresh graduates discover
            opportunities, build their skills, and connect with the right
            career path.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => setPage('signup')}
            >
              Get Started →
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage('signup')}
            >
              Explore Opportunities
            </button>

          </div>

        </div>

        <div className="hero-card">

          <div className="card-icon">
            🚀
          </div>

          <h2>
            Your Career Starts Here
          </h2>

          <p>
            Learn skills, discover opportunities and connect with employers.
          </p>

          <div className="stats">

            <div>
              <strong>500+</strong>
              <small>Opportunities</small>
            </div>

            <div>
              <strong>100+</strong>
              <small>Companies</small>
            </div>

            <div>
              <strong>1K+</strong>
              <small>Students</small>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="features-section"
      >

        <p className="section-label">
          WHAT WE OFFER
        </p>

        <h2>
          Everything You Need To Start
        </h2>

        <div className="features">

          <div className="feature-card">

            <div className="feature-icon">
              💼
            </div>

            <h3>
              Find Opportunities
            </h3>

            <p>
              Discover internships, jobs and opportunities designed for
              freshers.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📚
            </div>

            <h3>
              Build Your Skills
            </h3>

            <p>
              Improve your technical and professional skills with useful
              resources.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🤝
            </div>

            <h3>
              Connect
            </h3>

            <p>
              Connect with companies, recruiters and other students.
            </p>

          </div>

        </div>

      </section>

      {/* About */}
      <section
        id="about"
        className="about-section"
      >

        <div>

          <p className="section-label">
            ABOUT FRESHERCONNECT
          </p>

          <h2>
            Making the first career step easier.
          </h2>

        </div>

        <p>
          FresherConnect is designed to bridge the gap between students and
          the professional world. Our goal is to make it easier for freshers
          to find opportunities and prepare themselves for their careers.
        </p>

      </section>

      {/* Footer */}
      <footer>

        <div className="logo">
          <span>F</span> FresherConnect
        </div>

        <p>
          © 2026 FresherConnect. All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default App