import express from 'express'
import { supabase } from '../db/supabase.js'
import { adminAuthMiddleware } from '../middleware/adminAuth.js'

const router = express.Router()

router.post('/unlock', adminAuthMiddleware, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('settings')
      .update({ challenge_unlocked: true, updated_at: new Date().toISOString() })
      .eq('id', (await supabase.from('settings').select('id').single()).data.id)

    if (error) {
      throw error
    }

    res.json({ message: 'Challenge unlocked' })
  } catch (error) {
    next(error)
  }
})

router.post('/lock', adminAuthMiddleware, async (req, res, next) => {
  try {
    const { data: settings } = await supabase.from('settings').select('id').single()

    const { error } = await supabase
      .from('settings')
      .update({ challenge_unlocked: false, updated_at: new Date().toISOString() })
      .eq('id', settings.id)

    if (error) {
      throw error
    }

    res.json({ message: 'Challenge locked' })
  } catch (error) {
    next(error)
  }
})

router.post('/reset', adminAuthMiddleware, async (req, res, next) => {
  try {
    const { error: deleteError } = await supabase
      .from('students')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      throw deleteError
    }

    const { data: settings } = await supabase.from('settings').select('id').single()

    const { error: resetError } = await supabase
      .from('settings')
      .update({
        challenge_unlocked: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)

    if (resetError) {
      throw resetError
    }

    res.json({ message: 'Leaderboard reset' })
  } catch (error) {
    next(error)
  }
})

router.get('/stats', adminAuthMiddleware, async (req, res, next) => {
  try {
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('flag_found')

    if (studentsError) {
      throw studentsError
    }

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('challenge_unlocked')
      .single()

    if (settingsError) {
      throw settingsError
    }

    const flagsFound = students.filter(s => s.flag_found).length
    const stillSolving = students.length - flagsFound

    res.json({
      totalStudents: students.length,
      flagsFound: flagsFound,
      stillSolving: stillSolving,
      challengeUnlocked: settings.challenge_unlocked
    })
  } catch (error) {
    next(error)
  }
})

export default router
