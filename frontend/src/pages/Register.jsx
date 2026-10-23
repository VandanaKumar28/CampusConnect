import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await register(fullName, email, password, role)
      navigate('/resources')
    } catch (err) {
      if (err.response?.status === 409) {
        setError('An account with this email already exists.')
      } else if (err.response?.status === 400) {
        setError('Please check your details and try again.')
      } else if (!err.response) {
        setError(
          'Unable to connect to the server. Please make sure the backend is running.'
        )
      } else {
        setError('Could not create your account. Please try again.')
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
          Get started
        </p>

        <h1>Create account</h1>

        <p>
          Set up your CampusConnect profile.
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

      {/* Form */}
      <div className="card">

        <form
          className="stack"
          onSubmit={handleSubmit}
        >

          <div>
            <label>Full name</label>

            <input
              value={fullName}
              placeholder="Your full name"
              disabled={loading}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              placeholder="Create a password"
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Role</label>

            <select
              value={role}
              disabled={loading}
              onChange={e => setRole(e.target.value)}
            >
              <option value="STUDENT">
                Student
              </option>

              <option value="FACULTY">
                Faculty
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: 12,
                marginTop: 6
              }}
            >
              Choose the role associated with your account.
            </p>
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
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>

        </form>

      </div>

      {/* Login */}
      <p
        style={{
          marginTop: 18,
          fontSize: 14,
          textAlign: 'center',
          color: 'var(--muted)'
        }}
      >
        Already have an account?{' '}

        <Link
          to="/login"
          style={{
            color: 'var(--amber-deep)',
            fontWeight: 600
          }}
        >
          Sign in
        </Link>
      </p>

    </div>
  )
}