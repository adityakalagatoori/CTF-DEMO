import React from 'react'
import '../styles/Header.css'

export default function Header({ currentUser, onLogout, title = 'CTF Workshop' }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">🚩 {title}</h1>
        </div>
        <div className="header-right">
          {currentUser ? (
            <div className="user-section">
              <span className="user-name">👤 {currentUser.name}</span>
              <button onClick={onLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <span className="welcome">Welcome!</span>
          )}
        </div>
      </div>
    </header>
  )
}
