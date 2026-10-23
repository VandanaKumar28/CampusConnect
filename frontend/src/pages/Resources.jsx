import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    startTime: '',
    endTime: '',
    purpose: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setLoading(true)

    api
      .get('/resources')
      .then(res => setResources(res.data))
      .catch(() => setError('Could not load resources.'))
      .finally(() => setLoading(false))
  }, [])

  const openBooking = (resource) => {
    setBooking(resource)

    setForm({
      startTime: '',
      endTime: '',
      purpose: ''
    })

    setError('')
    setSuccess('')
  }

  const submitBooking = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await api.post('/bookings', {
        resourceId: booking.id,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
      })

      setSuccess(
        `Booking request for "${booking.name}" submitted successfully.`
      )

      setBooking(null)
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          'That time slot overlaps an existing booking. Please choose another time.'
        )
      } else {
        setError(
          'Could not create booking. Please check your inputs.'
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>

      {/* Header */}
      {!booking && (
        <div className="page-header">
          <div
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
                Campus facilities
              </p>

              <h1>Find a space.</h1>

              <p>
                Browse available campus resources and reserve the right
                space for your next session.
              </p>
            </div>

            <div
              className="card"
              style={{
                padding: '12px 18px',
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 700
                }}
              >
                {resources.length}
              </div>

              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 12
                }}
              >
                Available resources
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            borderColor: 'rgba(40,122,82,0.3)',
            background: 'var(--green-soft)',
            color: 'var(--green-live)'
          }}
        >
          ✓ {success}
        </div>
      )}

      {/* Resource Cards */}
      {!booking && (
        <>
          {error && (
            <div
              className="error-banner"
              style={{ marginBottom: 20 }}
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              className="card"
              style={{
                padding: 50,
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

              Loading campus resources...
            </div>
          )}

          {/* Resources */}
          {!loading && resources.length > 0 && (
            <div className="grid">
              {resources.map(r => (
                <div
                  className="card resource-card"
                  key={r.id}
                >
                  <span className="category-tag">
                    {r.category}
                  </span>

                  <h3 style={{ marginBottom: 8 }}>
                    {r.name}
                  </h3>

                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: 14,
                      margin: '0 0 16px',
                      lineHeight: 1.6
                    }}
                  >
                    {r.location}
                    {r.capacity
                      ? ` · Capacity ${r.capacity}`
                      : ''}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      marginTop: 'auto'
                    }}
                  >
                    {r.requiresApproval ? (
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--amber-deep)',
                          fontWeight: 600
                        }}
                      >
                        Approval required
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--green-live)',
                          fontWeight: 600
                        }}
                      >
                        Instant confirmation
                      </span>
                    )}

                    <button
                      className="btn btn-primary"
                      onClick={() => openBooking(r)}
                    >
                      Book this →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading &&
            resources.length === 0 &&
            !error && (
              <div
                className="card"
                style={{
                  textAlign: 'center',
                  padding: 50,
                  color: 'var(--muted)'
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: 10
                  }}
                >
                  🏫
                </div>

                <strong>
                  No active resources available
                </strong>

                <p
                  style={{
                    fontSize: 13,
                    marginTop: 6
                  }}
                >
                  Check again later for available campus facilities.
                </p>
              </div>
            )}
        </>
      )}

      {/* Booking Form */}
      {booking && (
        <div
          className="card"
          style={{
            maxWidth: 560,
            margin: '0 auto'
          }}
        >
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => setBooking(null)}
            style={{ marginBottom: 24 }}
            disabled={submitting}
          >
            ← Back to resources
          </button>

          <span className="category-tag">
            {booking.category}
          </span>

          <h2 style={{ marginBottom: 8 }}>
            Book {booking.name}
          </h2>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 24
            }}
          >
            {booking.requiresApproval
              ? 'Your request will be sent to an administrator for approval.'
              : 'Your booking will be confirmed immediately.'}
          </p>

          {error && (
            <div
              className="error-banner"
              style={{ marginBottom: 18 }}
            >
              {error}
            </div>
          )}

          <form
            className="stack"
            onSubmit={submitBooking}
          >
            <div>
              <label>Start time</label>

              <input
                type="datetime-local"
                required
                disabled={submitting}
                value={form.startTime}
                onChange={e =>
                  setForm({
                    ...form,
                    startTime: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label>End time</label>

              <input
                type="datetime-local"
                required
                disabled={submitting}
                value={form.endTime}
                onChange={e =>
                  setForm({
                    ...form,
                    endTime: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label>Purpose</label>

              <textarea
                rows={4}
                disabled={submitting}
                placeholder="What will you use this resource for?"
                value={form.purpose}
                onChange={e =>
                  setForm({
                    ...form,
                    purpose: e.target.value
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 4
              }}
            >
              <button
                className="btn btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Submitting...'
                  : 'Confirm request'}
              </button>

              <button
                className="btn btn-outline"
                type="button"
                disabled={submitting}
                onClick={() => setBooking(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}