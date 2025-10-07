import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the hostname
  const hostname = request.headers.get('host') || '';
  
  // Create a response
  const response = NextResponse.next();
  
  // Add a custom header with the hostname
  response.headers.set('x-hostname', hostname);
  
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (internal Next.js paths)
     * 3. /_static (static files)
     * 4. All files in the public folder
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};