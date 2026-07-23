import express from 'express'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.get('/status', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('challenge_unlocked')
      .single()

    if (error) {
      throw error
    }

    res.json({ unlocked: data.challenge_unlocked })
  } catch (error) {
    next(error)
  }
})

export default router
