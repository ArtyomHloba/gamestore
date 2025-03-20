import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itpbidbnplozdssknhbm.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cGJpZGJucGxvemRzc2tuaGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTMyMTUsImV4cCI6MjA1Nzk4OTIxNX0.Ept0hvPzzfT_cAKLg1tSl2j05fJjqRlD2JzjaRbYb5A'

export const supabase = createClient(supabaseUrl, supabaseKey)
