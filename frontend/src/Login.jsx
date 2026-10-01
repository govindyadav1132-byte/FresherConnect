import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

function Login({ onBack, onSignup, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile, error: profileError } =
        await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', data.user.id)
          .single()

      if (profileError) {
        const userName =
          data.user.user_metadata?.full_name || 'User'

        setMessage(`Welcome back, ${userName}!`)

        onLoginSuccess({
          id: data.user.id,
          full_name: userName,
        })
      } else {
        const userName =
          profile?.full_name || 'User'

        setMessage(`Welcome back, ${userName}!`)

        onLoginSuccess({
          id: data.user.id,
          full_name: userName,
        })
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* BACK BUTTON */}
        {onBack && (
          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            ← Back
          </button>
        )}

        <div className="auth-logo">
          <span>F</span> FresherConnect
        </div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Login to continue your journey.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="switch-auth">
          Don't have an account?

          <button
            type="button"
            onClick={onSignup}
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  )
}

export default Login