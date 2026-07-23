import express from 'express'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('flag_found', { ascending: false })
      .order('solved_time', { ascending: true })

    if (error) {
      throw error
    }

    const leaderboard = data.map((student, index) => ({
      id: student.id,
      name: student.name,
      flagFound: student.flag_found,
      solvedTime: student.solved_time,
      submissionTime: student.submission_time_seconds,
      registeredAt: student.registered_at,
      rank: index + 1
    }))

    res.json(leaderboard)
  } catch (error) {
    next(error)
  }
})

export default router
