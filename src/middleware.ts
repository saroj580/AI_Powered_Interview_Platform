import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/'];

// Routes that are only for unauthenticated users
const AUTH_ROUTES = ['/login', '/register'];

// Routes that are protected and require authentication
const PROTECTED_ROUTES_PATTERNS = [
  /^\/onboarding/,
  /^\/dashboard/,
  /^\/recruiter/,
  /^\/admin/,
  /^\/candidate/,
  /^\/api\/v1\//,
];

interface DecodedToken {
  userId: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  onboardingCompleted: boolean;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  // If no token
  if (!token) {
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Redirect protected routes to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  // Verify token (optional - can add proper validation)
  let decoded: DecodedToken | null = null;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists but route is auth route (login/register), redirect to appropriate dashboard
  if (AUTH_ROUTES.includes(pathname)) {
    // Redirect based on onboarding status and role
    if (!decoded.onboardingCompleted) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Redirect to role-appropriate dashboard
    if (decoded.role === 'RECRUITER') {
      return NextResponse.redirect(new URL('/recruiter', request.url));
    }
    if (decoded.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // User is authenticated but onboarding is incomplete
  if (!decoded.onboardingCompleted && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // If user tries to access onboarding but is already complete, redirect to dashboard
  if (decoded.onboardingCompleted && pathname.startsWith('/onboarding')) {
    if (decoded.role === 'RECRUITER') {
      return NextResponse.redirect(new URL('/recruiter', request.url));
    }
    if (decoded.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based access control for dashboard routes
  if (pathname.startsWith('/recruiter') && decoded.role !== 'RECRUITER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and api routes we don't need middleware for
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
