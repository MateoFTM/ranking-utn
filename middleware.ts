import { createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  const adminRoutes = ['/admin'];

  if (path.includes('/evaluar') && !session) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(path)}`, req.url));
  }

  if (adminRoutes.some(r => path.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/auth/login', req.url));
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', session.user.id)
      .single();

    if (profile?.is_banned) return NextResponse.redirect(new URL('/suspendido', req.url));
    if (!['admin', 'moderator'].includes(profile?.role ?? '')) return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profesor/:path*/evaluar'],
};
