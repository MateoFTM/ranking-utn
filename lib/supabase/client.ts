import { createBrowserClient } from '@supabase/ssr';

// Asumimos que los tipos de la base de datos se generarán aquí en el futuro
export type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co';

if (isPlaceholder && typeof window !== 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL no está configurada. Usando URL de placeholder. Las peticiones a la base de datos fallarán con "Failed to fetch".');
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: !isPlaceholder,
      persistSession: !isPlaceholder,
      detectSessionInUrl: !isPlaceholder
    }
  }
);
