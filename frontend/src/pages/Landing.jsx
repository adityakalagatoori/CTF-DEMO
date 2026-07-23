import React, { useState } from 'react'
import { api } from '../services/api'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/Landing.css'

export default function Landing({ onStudentRegistered }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [challengeUnlocked, setChallengeUnlocked] = useState(false)

  React.useEffect(() => {
    fetchLeaderboard()
    fetchChallengeStatus()
    const interval = setInterval(() => {
      fetchLeaderboard()
      fetchChallengeStatus()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const data = await api.leaderboard.get()
      setLeaderboard(data)
      setTotalStudents(data.length)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchChallengeStatus = async () => {
    try {
      const data = await api.challenge.getStatus()
      setChallengeUnlocked(data.unlocked)
    } catch (error) {
      console.error('Error fetching challenge status:', error)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setMessage({ text: 'Please enter your name', type: 'error' })
      return
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      setMessage({ text: 'Name must be between 2 and 50 characters', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const result = await api.students.register(name)
      setMessage({ text: '✅ Successfully registered! Redirecting...', type: 'success' })
      setTimeout(() => {
        onStudentRegistered(result.studentId, result.name)
      }, 1000)
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Registration failed. Try another name.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing-page">
      <Header title="CTF Workshop" />

      <div className="container">
        <div className="landing-content">
          <div className="landing-left">
            <div className="registration-panel glass">
              <div className="panel-header">
                <h2>🎯 Register Now</h2>
                <p>Join {totalStudents} students</p>
              </div>

              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>

              <div className="challenge-status">
                <h3>Challenge Status</h3>
                <p className="status-badge">
                  {challengeUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                </p>
              </div>

              <div className="info-box">
                <h3>🕵️ About This CTF</h3>
                <p>
                  This is a capture-the-flag challenge designed to teach you about
                  web security and browser developer tools. Find the hidden flag and
                  be the first to submit it!
                </p>
              </div>

              <div className="admin-link">
                <a href="#admin">
                  👨‍💼 Admin Panel
                </a>
              </div>
            </div>
          </div>

          <div className="landing-right">
            <Leaderboard leaderboard={leaderboard} compact={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
