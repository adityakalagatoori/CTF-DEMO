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
                  <h3>📋 Instructions</h3>
                  <ol>
                    <li>Open this website in your browser (you're already here!)</li>
                    <li>Right-click on the page and select "Inspect" or "Inspect Element"</li>
                    <li>Look through the HTML source code (or use Ctrl+F / Cmd+F)</li>
                    <li>Search for hidden comments, meta tags, or data attributes</li>
                    <li>Find the secret word hidden in the code</li>
                    <li>Submit it below to capture the flag</li>
                  </ol>
                </div>

                <div className="hints">
                  <h3>💡 Hints</h3>
                  <p><strong>Hint 1:</strong> Use browser developer tools (F12 or Right-click → Inspect)</p>
                  <p><strong>Hint 2:</strong> The flag might be in HTML comments, meta tags, or JavaScript</p>
                  <p><strong>Hint 3:</strong> Try searching with Ctrl+F in the Inspector</p>
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
