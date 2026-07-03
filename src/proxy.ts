import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/'];
const PUBLIC_API_PREFIXES = ['/api/v1/auth/'];

const AUTH_ROUTES = ['/login', '/register'];

const PROTECTED_ROUTE_PATTERNS = [
  /^\/onboarding/,
  /^\/dashboard/,
  /^\/recruiter/,
  /^\/admin/,
  /^\/candidate/,
  /^\/api\/v1\//,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtectedRoute = PROTECTED_ROUTE_PATTERNS.some((p) => p.test(pathname));

  if (!token) {
    if (isPublicRoute) return NextResponse.next();
    if (isProtectedRoute) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (AUTH_ROUTES.includes(pathname)) {
    if (!decoded.onboardingCompleted) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (decoded.role === 'RECRUITER') return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    if (decoded.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  if (!decoded.onboardingCompleted && !pathname.startsWith('/onboarding') && !pathname.startsWith('/api/v1/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (decoded.onboardingCompleted && pathname.startsWith('/onboarding')) {
    if (decoded.role === 'RECRUITER') return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    if (decoded.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  if (pathname.startsWith('/recruiter') && decoded.role !== 'RECRUITER') {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }
  if (pathname.startsWith('/candidate') && decoded.role === 'RECRUITER') {
    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
  }
  if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
