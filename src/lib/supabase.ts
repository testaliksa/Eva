import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для базы данных
export interface MoodEntry {
  id?: string
  created_at?: string
  date: string
  time_of_day: 'morning' | 'evening'
  mood: string
  energy: number | null
  anxiety: number | null
  sleep: number | null
  note: string | null
}

export interface JournalEntry {
  id?: string
  created_at?: string
  date: string
  question1: string
  question2: string
  question3: string
  question4: string
}
