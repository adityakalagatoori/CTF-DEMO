import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  students: {
    register: async (name) => {
      const response = await client.post('/api/students/register', { name })
      return response.data
    },

    submitFlag: async (studentId, flag) => {
      const response = await client.post(`/api/students/${studentId}/submit-flag`, { flag })
      return response.data
    },

    getAll: async () => {
      const response = await client.get('/api/students')
      return response.data
    },
  },

  leaderboard: {
    get: async () => {
      const response = await client.get('/api/leaderboard')
      return response.data
    },
  },

  challenge: {
    getStatus: async () => {
      const response = await client.get('/api/challenge/status')
      return response.data
    },
  },

  admin: {
    unlock: async (password) => {
      const response = await client.post('/api/admin/unlock', {}, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      })
      return response.data
    },

    lock: async (password) => {
      const response = await client.post('/api/admin/lock', {}, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      })
      return response.data
    },

    reset: async (password) => {
      const response = await client.post('/api/admin/reset', {}, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      })
      return response.data
    },

    getStats: async (password) => {
      const response = await client.get('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      })
      return response.data
    },
  },
}

export default api
