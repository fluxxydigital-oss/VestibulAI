import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

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
 * Verify JWT token from cookies
 */
function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return true;
  } catch (error) {
    return false;
  }
}

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

  // For protected routes, verify authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/correcao-de-redacao')) {
    const authToken = request.cookies.get('auth_token')?.value;

    // No token found, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token is invalid, redirect to login
    if (!verifyToken(authToken)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token is valid, allow request
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
