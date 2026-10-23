import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import api from '../api/client'

export default function AdminAnalytics() {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/analytics/utilization')
      .then(res => setData(res.data))
      .catch(() => setError('Could not load analytics data.'))
  }, [])

  const totalApproved = useMemo(
    () =>
      data.reduce(
        (total, item) => total + (item.approvedBookings || 0),
        0
      ),
    [data]
  )

  const mostPopular = useMemo(() => {
    if (!data.length) return null

    return data.reduce((highest, current) =>
      (current.approvedBookings || 0) >
      (highest.approvedBookings || 0)
        ? current
        : highest
    )
  }, [data])

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
          Administration · Insights
        </p>

        <h1>Resource analytics</h1>

        <p>
          Understand which campus resources are being used most frequently.
        </p>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 16,
          marginBottom: 22
        }}
      >

        <div className="card">
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 700
            }}
          >
            {data.length}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              fontSize: 13
            }}
          >
            Resources tracked
          </div>
        </div>

        <div className="card">
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 700,
              color: 'var(--green-live)'
            }}
          >
            {totalApproved}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              fontSize: 13
            }}
          >
            Approved bookings
          </div>
        </div>

        <div className="card">
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 4
            }}
          >
            {mostPopular
              ? mostPopular.resourceName
              : '—'}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              fontSize: 13
            }}
          >
            Most requested resource
          </div>
        </div>

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

      {/* Chart */}
      <div className="card">

        <div style={{ marginBottom: 20 }}>
          <h3>Booking utilization</h3>

          <p
            style={{
              margin: '5px 0 0',
              color: 'var(--muted)',
              fontSize: 13
            }}
          >
            Number of approved bookings by resource.
          </p>
        </div>

        {data.length === 0 ? (
          <div
            style={{
              height: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--muted)'
            }}
          >
            No approved booking data available yet.
          </div>
        ) : (
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 45
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />

                <XAxis
                  dataKey="resourceName"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={65}
                  tick={{
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: 'rgba(200, 117, 42, 0.06)'
                  }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    boxShadow:
                      '0 8px 24px rgba(23, 32, 42, 0.08)'
                  }}
                />

                <Bar
                  dataKey="approvedBookings"
                  name="Approved bookings"
                  fill="#C8752A"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

    </div>
  )
}