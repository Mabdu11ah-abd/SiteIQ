// frontend/site-iq/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that do not require authentication.
// These patterns allow specific pages and their sub-paths (if applicable) to be accessible
// to both authenticated and unauthenticated users.
const isPublicRoute = createRouteMatcher([
  '/', // The homepage/root landing page
  '/aboutus', // Your about page
  '/features', // Your features page
  '/pricing', // Your pricing page
  '/cancel', // Cancel page
  '/privacy-policy', // Privacy policy page
  '/terms-of-service', // Terms of service page
  '/sign-in(.*)', // Clerk's sign-in routes
  '/sign-up(.*)', // Clerk's sign-up routes
  // Next.js static assets and internal routes should also be public
  '/_next/static(.*)', // Static files (JS, CSS, images)
  '/_next/image(.*)', // Next.js image optimization
  '/favicon.ico', // Favicon
]);

// Apply the Clerk middleware.
// For routes that are NOT public, protect them, meaning a user must be authenticated.
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Define the routes that the middleware should run on.
// This is an optional optimization. If not specified, it runs on all routes.
// We explicitly tell it to match all paths except API routes, static files handled by Next.js itself, etc.
export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
