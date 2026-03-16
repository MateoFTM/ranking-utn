import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

// Asumimos que los tipos de la base de datos se generarán aquí en el futuro
export type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
