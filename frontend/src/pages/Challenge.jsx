import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/Challenge.css'

export default function Challenge({ currentUser, onLogout }) {
  const [flag, setFlag] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [challengeUnlocked, setChallengeUnlocked] = useState(false)
  const [solveTime, setSolveTime] = useState(null)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    fetchChallengeStatus()
    fetchLeaderboard()
    const interval = setInterval(() => {
      fetchChallengeStatus()
      fetchLeaderboard()
    }, 2000)
    return () => clearInterval(interval)
  }, [currentUser?.id])

  const fetchChallengeStatus = async () => {
    try {
      const data = await api.challenge.getStatus()
      setChallengeUnlocked(data.unlocked)
    } catch (error) {
      console.error('Error fetching challenge status:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const data = await api.leaderboard.get()
      setLeaderboard(data)
      const currentUserData = data.find(s => s.id === currentUser?.id)
      if (currentUserData) {
        setSolveTime(currentUserData.submissionTime)
        setUserRank(currentUserData.rank)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const handleFlagSubmit = async (e) => {
    e.preventDefault()

    if (!flag.trim()) {
      setMessage({ text: 'Please enter a flag', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const result = await api.students.submitFlag(currentUser.id, flag)
      if (result.success) {
        setMessage({ text: '🎉 Flag captured! You solved it!', type: 'success' })
        setFlag('')
        setTimeout(() => fetchLeaderboard(), 500)
      } else {
        setMessage({ text: '❌ Incorrect flag. Try again!', type: 'error' })
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Submission failed',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const isUserSolved = currentUser?.flagFound || solveTime !== null

  return (
    <div className="challenge-page">
      <Header currentUser={currentUser} onLogout={onLogout} />

      <div className="container">
        <div className="challenge-content">
          <div className="challenge-left">
            {!challengeUnlocked ? (
              <div className="challenge-panel glass challenge-locked">
                <div className="lock-icon">🔒</div>
                <h2>Challenge Locked</h2>
                <p>
                  The challenge hasn't been unlocked yet. Wait for your instructor
                  to unlock it. Check the leaderboard to see who's already registered!
                </p>
                <div className="students-waiting">
                  <h3>Students Registered: {leaderboard.length}</h3>
                </div>
              </div>
            ) : isUserSolved ? (
              <div className="challenge-panel glass challenge-solved">
                <div className="trophy-icon">🏆</div>
                <h2>Flag Captured!</h2>
                <p className="flag-text">BIOMOLECLUESS</p>
                <div className="solve-info">
                  <p><strong>Solved in:</strong> {solveTime} seconds</p>
                  <p><strong>Your Rank:</strong> #{userRank}</p>
                </div>
                <div className="celebrate">
                  <p>🎉 Congratulations! You found the hidden flag!</p>
                </div>
              </div>
            ) : (
              <div className="challenge-panel glass challenge-active">
                <div className="unlock-icon">🔓</div>
                <h2>Challenge Active</h2>

                {message && (
                  <div className={`alert alert-${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="instructions">
                  <h3>📋 Your Challenge</h3>
                  <div className="puzzle-box">
                    <p className="puzzle-title">🧩 Solve This Puzzle:</p>
                    <p className="puzzle-text">
                      <strong>"In biology, we study large organic compounds made of carbon, hydrogen,
                      oxygen, and sometimes nitrogen. Find the scientific term for these compounds."</strong>
                    </p>
                  </div>
                </div>

                <div className="hints">
                  <h3>💡 How to Solve & Submit</h3>
                  <p><strong>Step 1:</strong> Use ChatGPT, Google, or ask your instructor to solve the puzzle</p>
                  <p><strong>Step 2:</strong> Type your answer in the field below</p>
                  <p><strong>Step 3:</strong> Click "Submit Flag" to verify your answer</p>
                  <p><strong>⚡ Speed wins:</strong> Fastest correct submission ranks highest!</p>
                </div>

                <form onSubmit={handleFlagSubmit}>
                  <div className="form-group">
                    <label htmlFor="flag">Submit Flag</label>
                    <input
                      id="flag"
                      type="text"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      placeholder="Type the flag here..."
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-submit"
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Checking...
                      </>
                    ) : (
                      'Submit Flag'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="challenge-right">
            <Leaderboard leaderboard={leaderboard} currentUserId={currentUser?.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
