// frontend/site-iq/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that do not require authentication
const publicRoutes = [
  '/',
  '/aboutus',
  '/features',
  '/pricing',
  '/cancel',
  '/privacy-policy',
  '/terms-of-service',
  '/login',
  '/register',
  '/sign-in',
  '/sign-up',
];

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    // Allow wildcard matching (e.g., /sign-in/*)
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for JWT token in cookies or could check localStorage via client-side routing
  // Note: localStorage cannot be accessed in middleware, so we'll use a cookie-based approach
  // or rely on the AuthContext to handle redirects on the client side
  
  // For now, let the client-side AuthContext handle authentication redirects
  // Middleware will just pass through, and protected pages will check auth state
  return NextResponse.next();
}

// Define the routes that the middleware should run on
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
