import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import Resources from './pages/Resources'
import MyBookings from './pages/MyBookings'
import AdminApprovals from './pages/AdminApprovals'
import AdminAnalytics from './pages/AdminAnalytics'

function Shell({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">

      {/* Navigation */}
      <header className="topbar">

        {/* Brand */}
        <NavLink
          to={user ? '/resources' : '/login'}
          className="brand"
        >
          <span className="dot" />
          CampusConnect
        </NavLink>

        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18
            }}
          >

            {/* Navigation */}
            <nav className="nav-links">

              <NavLink to="/resources">
                Resources
              </NavLink>

              <NavLink to="/my-bookings">
                My Bookings
              </NavLink>

              {user.role === 'ADMIN' && (
                <>
                  <NavLink to="/admin/approvals">
                    Approvals
                  </NavLink>

                  <NavLink to="/admin/analytics">
                    Analytics
                  </NavLink>
                </>
              )}

            </nav>

            {/* User area */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingLeft: 14,
                borderLeft: '1px solid var(--line)'
              }}
            >

              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'var(--amber-soft)',
                  color: 'var(--amber-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.2
                }}
              >
                <strong
                  style={{
                    fontSize: 13
                  }}
                >
                  {user.fullName}
                </strong>

                <span
                  style={{
                    color: 'var(--muted)',
                    fontSize: 11,
                    marginTop: 3
                  }}
                >
                  {user.role === 'ADMIN'
                    ? 'Administrator'
                    : 'Student'}
                </span>
              </div>

              <button
                className="btn btn-outline"
                onClick={logout}
              >
                Sign out
              </button>

            </div>
          </div>
        )}

        {!user && (
          <nav className="nav-links">
            <NavLink to="/login">
              Sign in
            </NavLink>

            <NavLink
              to="/register"
              className="btn btn-primary"
            >
              Create account
            </NavLink>
          </nav>
        )}

      </header>

      {/* Page */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: 70,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          color: 'var(--muted)',
          fontSize: 12
        }}
      >
        <span>
          © {new Date().getFullYear()} CampusConnect
        </span>

        <span>
          Smart campus resource booking
        </span>
      </footer>

    </div>
  )
}

function Protected({ children, adminOnly }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/resources" replace />
  }

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Shell>

          <Routes>

            {/* Public */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* Student / authenticated */}
            <Route
              path="/resources"
              element={
                <Protected>
                  <Resources />
                </Protected>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <Protected>
                  <MyBookings />
                </Protected>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/approvals"
              element={
                <Protected adminOnly>
                  <AdminApprovals />
                </Protected>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <Protected adminOnly>
                  <AdminAnalytics />
                </Protected>
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/resources"
                  replace
                />
              }
            />

          </Routes>

        </Shell>

      </BrowserRouter>
    </AuthProvider>
  )
}