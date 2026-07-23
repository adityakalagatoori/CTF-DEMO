import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'
import '../styles/Admin.css'

export default function Admin({ onLogout }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [stats, setStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [challengeUnlocked, setChallengeUnlocked] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchLeaderboard()
      const interval = setInterval(() => {
        fetchStats()
        fetchLeaderboard()
        setLastUpdated(new Date())
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.admin.getStats(password)
      setIsAuthenticated(true)
      setMessage({ text: '✅ Admin authenticated', type: 'success' })
    } catch (error) {
      setMessage({ text: '❌ Invalid password', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await api.admin.getStats(password)
      setStats(data)
      setChallengeUnlocked(data.challengeUnlocked)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const data = await api.leaderboard.get()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const handleUnlock = async () => {
    setLoading(true)
    try {
      await api.admin.unlock(password)
      setMessage({ text: '🔓 Challenge unlocked!', type: 'success' })
      fetchStats()
    } catch (error) {
      setMessage({ text: 'Failed to unlock challenge', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLock = async () => {
    setLoading(true)
    try {
      await api.admin.lock(password)
      setMessage({ text: '🔒 Challenge locked', type: 'success' })
      fetchStats()
    } catch (error) {
      setMessage({ text: 'Failed to lock challenge', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('⚠️ Are you sure? This will delete all student data.')) {
      return
    }

    setLoading(true)
    try {
      await api.admin.reset(password)
      setMessage({ text: '✅ Leaderboard reset', type: 'success' })
      fetchStats()
      fetchLeaderboard()
    } catch (error) {
      setMessage({ text: 'Failed to reset leaderboard', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <Header title="Admin Panel" />

        <div className="container">
          <div className="admin-login">
            <div className="login-panel glass">
              <div className="lock-icon">🔐</div>
              <h2>Admin Authentication</h2>

              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="password">Admin Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>

              <button onClick={onLogout} className="btn-secondary">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <Header title="Admin Panel" />

      <div className="container">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="admin-grid">
          <div className="admin-left">
            <div className="stats-panel glass">
              <h2>📊 Statistics</h2>

              {stats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-label">Total Students</p>
                    <p className="stat-value">{stats.totalStudents}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Flags Found</p>
                    <p className="stat-value">{stats.flagsFound}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Still Solving</p>
                    <p className="stat-value">{stats.stillSolving}</p>
                  </div>
                </div>
              )}

              <div className="challenge-control glass">
                <h3>⚙️ Challenge Control</h3>
                <p className="status-badge">
                  {challengeUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                </p>

                <div className="button-group">
                  <button
                    onClick={handleUnlock}
                    disabled={loading || challengeUnlocked}
                    className="btn-unlock"
                  >
                    🔓 Unlock Challenge
                  </button>
                  <button
                    onClick={handleLock}
                    disabled={loading || !challengeUnlocked}
                    className="btn-lock"
                  >
                    🔒 Lock Challenge
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="btn-danger"
                >
                  ⚠️ Reset Leaderboard
                </button>
              </div>

              <div className="last-updated">
                <small>Last updated: {lastUpdated.toLocaleTimeString()}</small>
              </div>
            </div>
          </div>

          <div className="admin-right">
            <div className="leaderboard-container glass">
              <Leaderboard leaderboard={leaderboard} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
