import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/api/health'];
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/auth/') || 
                        pathname.startsWith('/docs') ||
                        pathname === '/api/health';

  // Skip Supabase if credentials are not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Allow access to static files and Next.js internals without auth check
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // If no Supabase config, allow all requests (dev mode)
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'https://your-project.supabase.co' ||
      supabaseKey === 'your-anon-key') {
    // In dev mode without Supabase, redirect to home if trying to access protected routes
    if (!isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Refresh session
    const { data: { user }, error } = await supabase.auth.getUser();

    // If no user and trying to access protected route, redirect to login
    if (error || !user) {
      if (!isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // If user is logged in and trying to access login/register, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow request to continue (fail open for development)
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
