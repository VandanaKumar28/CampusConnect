import { useEffect, useState } from 'react'
import api from '../api/client'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')

    api
      .get('/bookings/me')
      .then(res => setBookings(res.data))
      .catch(() => setError('Could not load your bookings.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const cancel = async (id) => {
    setError('')
    setCancelling(id)

    try {
      await api.patch(`/bookings/${id}/cancel`)
      load()
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This booking cannot be cancelled at this time.')
      } else {
        setError('Could not cancel the booking.')
      }
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div>

      {/* Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
          flexWrap: 'wrap'
        }}
      >
        <div>
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
            Your activity
          </p>

          <h1>My bookings</h1>

          <p>
            Everything you've requested, past and upcoming.
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
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

      {/* Loading */}
      {loading ? (
        <div
          className="card"
          style={{
            padding: 55,
            textAlign: 'center',
            color: 'var(--muted)'
          }}
        >
          <div
            style={{
              fontSize: 28,
              marginBottom: 10
            }}
          >
            ⟳
          </div>

          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (

        /* Empty */
        <div
          className="card"
          style={{
            padding: 55,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: 34,
              marginBottom: 12
            }}
          >
            📅
          </div>

          <h3 style={{ marginBottom: 6 }}>
            No bookings yet
          </h3>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: 14,
              margin: 0
            }}
          >
            Your campus resource bookings will appear here.
          </p>
        </div>

      ) : (

        /* Bookings */
        <div className="card">

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
              gap: 10
            }}
          >
            <div>
              <h3>Booking history</h3>

              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: 13,
                  margin: '4px 0 0'
                }}
              >
                {bookings.length}{' '}
                {bookings.length === 1
                  ? 'booking'
                  : 'bookings'} found
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>

                    <td>
                      <strong>
                        {b.resourceName}
                      </strong>
                    </td>

                    <td>
                      {new Date(
                        b.startTime
                      ).toLocaleString()}
                    </td>

                    <td>
                      {new Date(
                        b.endTime
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`status-pill status-${b.status}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td>
                      {(b.status === 'PENDING' ||
                        b.status === 'APPROVED') && (
                        <button
                          className="btn btn-danger"
                          disabled={cancelling === b.id}
                          onClick={() =>
                            cancel(b.id)
                          }
                        >
                          {cancelling === b.id
                            ? 'Cancelling...'
                            : 'Cancel'}
                        </button>
                      )}

                      {b.status === 'REJECTED' && (
                        <span
                          style={{
                            color: 'var(--muted)',
                            fontSize: 12
                          }}
                        >
                          Not approved
                        </span>
                      )}

                      {b.status === 'CANCELLED' && (
                        <span
                          style={{
                            color: 'var(--muted)',
                            fontSize: 12
                          }}
                        >
                          Cancelled
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  )
}