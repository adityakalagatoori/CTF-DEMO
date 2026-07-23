import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Check .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function initializeDatabase() {
  try {
    const { data, error } = await supabase.from('students').select('count', { count: 'exact' }).limit(1)

    if (error) {
      console.error('Database connection error:', error)
      throw error
    }

    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message)
    process.exit(1)
  }
}
