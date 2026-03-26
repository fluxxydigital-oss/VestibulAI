import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/politica-de-privacidade',
  '/termos-de-uso',
  '/banco-de-questoes',
  '/planos',
];

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, verify authentication presence
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/correcao-de-redacao')) {
    const authToken = request.cookies.get('auth_token')?.value;

    // No token found, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token is present, let the downstream APIs/Pages verify its validity
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
