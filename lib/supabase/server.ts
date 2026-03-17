import { createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { NextApiRequest, NextApiResponse } from 'next';

export function createPagesServerClient(req: NextApiRequest | any, res: NextApiResponse | any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co';

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: !isPlaceholder,
        persistSession: !isPlaceholder,
        detectSessionInUrl: !isPlaceholder
      },
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
}
