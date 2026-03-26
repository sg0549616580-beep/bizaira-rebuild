import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zlzrtyelqbdzydtemhyi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsenJ0eWVscWJkenlkdGVtaHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjM3OTEsImV4cCI6MjA4OTc5OTc5MX0.-dMqzS7ypULBpe4JnCMp4yv1t75I1nmsPrTasu8ZZGE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});