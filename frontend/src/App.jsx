import React, { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Challenge from './pages/Challenge'
import Admin from './pages/Admin'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('ctf_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      setCurrentPage('challenge')
    }
  }, [])

  const handleStudentRegistered = (studentId, name) => {
    const user = { id: studentId, name, flagFound: false }
    setCurrentUser(user)
    localStorage.setItem('ctf_user', JSON.stringify(user))
    setCurrentPage('challenge')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('ctf_user')
    setCurrentPage('landing')
  }

  const handleAdminAccess = () => {
    setCurrentPage('admin')
  }

  return (
    <div className="app">
      {currentPage === 'landing' && (
        <Landing onStudentRegistered={handleStudentRegistered} />
      )}

      {currentPage === 'challenge' && currentUser && (
        <Challenge
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin' && (
        <Admin onLogout={() => setCurrentPage('landing')} />
      )}

      {/* Admin link on landing page */}
      {currentPage === 'landing' && (
        <div className="admin-access-prompt">
          <button
            onClick={handleAdminAccess}
            className="btn-admin-access"
          >
            👨‍💼 Admin Panel
          </button>
        </div>
      )}
    </div>
  )
}
