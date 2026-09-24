import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

function Signup({ onBack, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    // Create account in Supabase Authentication
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    // Create profile linked to the Supabase Auth user
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            full_name: name,
          },
        ])

      if (profileError) {
        setMessage(
          'Account created, but profile could not be saved: ' +
            profileError.message
        )
        setLoading(false)
        return
      }

      setMessage('Account created successfully!')

      setName('')
      setEmail('')
      setPassword('')
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
          ← Back
        </button>

        <div className="auth-logo">
          <span>F</span> FresherConnect
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start your career journey today.
        </p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="switch-auth">
          Already have an account?

          <button onClick={onLogin}>
            Login
          </button>
        </p>

      </div>
    </div>
  )
}

export default Signup