import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/resources')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (!err.response) {
        setError(
          'Unable to connect to the server. Please make sure the backend is running.'
        )
      } else {
        setError('Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>

      {/* Header */}
      <div className="page-header">
        <p
          style={{
            color: 'var(--amber-deep)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 8px'
          }}
        >
          Welcome back
        </p>

        <h1>Sign in</h1>

        <p>
          Book labs, halls, and equipment across campus.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="error-banner"
          style={{ marginBottom: 18 }}
        >
          {error}
        </div>
      )}

      {/* Login Card */}
      <div className="card">

        <form
          className="stack"
          onSubmit={handleSubmit}
        >

          <div>
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 4
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

      </div>

      {/* Register */}
      <p
        style={{
          marginTop: 18,
          fontSize: 14,
          textAlign: 'center',
          color: 'var(--muted)'
        }}
      >
        Don't have an account?{' '}

        <Link
          to="/register"
          style={{
            color: 'var(--amber-deep)',
            fontWeight: 600
          }}
        >
          Create one
        </Link>
      </p>

    </div>
  )
}