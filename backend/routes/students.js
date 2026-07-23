import express from 'express'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const trimmedName = name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters' })
    }

    const { data: existing, error: checkError } = await supabase
      .from('students')
      .select('id')
      .eq('name', trimmedName)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'Name already registered' })
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{
        name: trimmedName,
        registered_at: new Date().toISOString(),
        flag_found: false
      }])
      .select()

    if (error) {
      throw error
    }

    res.status(201).json({
      studentId: data[0].id,
      name: data[0].name,
      registeredAt: data[0].registered_at
    })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/submit-flag', async (req, res, next) => {
  try {
    const { id } = req.params
    const { flag } = req.body

    if (!flag || !flag.trim()) {
      return res.status(400).json({ error: 'Flag is required' })
    }

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    if (student.flag_found) {
      return res.status(400).json({ error: 'Flag already submitted' })
    }

    const { data: settings } = await supabase
      .from('settings')
      .select('correct_flag')
      .single()

    const correctFlag = settings?.correct_flag || 'BIOMOLECLUESS'

    if (flag.toUpperCase() !== correctFlag.toUpperCase()) {
      return res.status(400).json({ success: false, message: 'Try again' })
    }

    const registeredTime = new Date(student.registered_at).getTime()
    const currentTime = new Date().getTime()
    const submissionTime = Math.floor((currentTime - registeredTime) / 1000)

    const { data: updated, error: updateError } = await supabase
      .from('students')
      .update({
        flag_found: true,
        solved_time: new Date().toISOString(),
        submission_time_seconds: submissionTime
      })
      .eq('id', id)
      .select()

    if (updateError) {
      throw updateError
    }

    res.json({
      success: true,
      message: 'Flag captured!',
      submissionTime: submissionTime
    })
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
})

export default router
