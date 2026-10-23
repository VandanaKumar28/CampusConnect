import { useEffect, useState } from 'react'
import api from '../api/client'

export default function AdminApprovals() {
  const [pending, setPending] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)

    api
      .get('/bookings/pending')
      .then(res => setPending(res.data))
      .catch(() => setError('Could not load the approval queue.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const decide = async (id, status) => {
    setError('')

    try {
      await api.patch(`/bookings/${id}/status`, { status })
      load()
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          'Cannot approve — another booking now overlaps this slot.'
        )
      } else {
        setError('Could not update this booking.')
      }
    }
  }

  return (
    <div>

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
          Administration
        </p>

        <h1>Approval queue</h1>

        <p>
          Review booking requests and keep campus resources running smoothly.
        </p>
      </div>

      {/* Summary */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 700,
              color: pending.length
                ? 'var(--amber-deep)'
                : 'var(--green-live)'
            }}
          >
            {pending.length}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              fontSize: 13
            }}
          >
            {pending.length === 1
              ? 'booking waiting for review'
              : 'bookings waiting for review'}
          </div>
        </div>

        <button
          className="btn btn-outline"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : '↻ Refresh'}
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

      {/* Queue */}
      <div className="card">

        {loading ? (
          <div
            style={{
              padding: 50,
              textAlign: 'center',
              color: 'var(--muted)'
            }}
          >
            Loading approval requests…
          </div>
        ) : pending.length === 0 ? (
          <div
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
              ✓
            </div>

            <h3 style={{ marginBottom: 6 }}>
              Nothing pending
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: 14,
                margin: 0
              }}
            >
              All booking requests have been reviewed.
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Requested by</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {pending.map(b => (
                <tr key={b.id}>

                  <td>
                    <strong>{b.resourceName}</strong>
                  </td>

                  <td>
                    {b.bookedByName}
                  </td>

                  <td>
                    {new Date(b.startTime).toLocaleString()}
                  </td>

                  <td>
                    {new Date(b.endTime).toLocaleString()}
                  </td>

                  <td>
                    {b.purpose || '—'}
                  </td>

                  <td>
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap'
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          decide(b.id, 'APPROVED')
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          decide(b.id, 'REJECTED')
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  )
}