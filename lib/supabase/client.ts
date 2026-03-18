import { createBrowserClient } from '@supabase/ssr';

export type Database = any; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co';

if (isPlaceholder && typeof window !== 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL no está configurada.');
}

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export const createClient = () => {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(
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

  return browserClient;
};

export const supabase = createClient();
