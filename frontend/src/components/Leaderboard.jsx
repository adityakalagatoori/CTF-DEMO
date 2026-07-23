import React from 'react'
import '../styles/Leaderboard.css'

export default function Leaderboard({ leaderboard, currentUserId, compact = false }) {
  const displayData = compact ? leaderboard.slice(0, 10) : leaderboard

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p className="no-data">No students yet. Be the first to register!</p>
      ) : (
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <div className="col-rank">Rank</div>
            <div className="col-name">Name</div>
            <div className="col-status">Status</div>
            <div className="col-time">Time</div>
          </div>
          <div className="leaderboard-body">
            {displayData.map((student, index) => (
              <div
                key={student.id}
                className={`leaderboard-row ${currentUserId === student.id ? 'current-user' : ''}`}
              >
                <div className="col-rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index >= 3 && `#${index + 1}`}
                </div>
                <div className="col-name">{student.name}</div>
                <div className="col-status">
                  {student.flagFound ? (
                    <span className="badge badge-success">✅ SOLVED</span>
                  ) : (
                    <span className="badge badge-pending">⏳ Solving</span>
                  )}
                </div>
                <div className="col-time">
                  {student.flagFound ? (
                    <span className="time-value">{student.submissionTime}s</span>
                  ) : (
                    <span className="time-value">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
