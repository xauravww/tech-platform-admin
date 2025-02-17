import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './app/lib/auth'; 

import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['', '/login', '/signup', '/services', '/products', '/research'];

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // console.log("token value middleware",token)

  // If token exists, decrypt and verify it
  let isAuthenticated = false;

  if (token) {
    // Use the custom decrypt function to verify the token
    const decryptedToken = await decrypt(token);

    // If decryption is successful, it will return the payload; otherwise, it's null
    if (decryptedToken) {
      isAuthenticated = true;
    }
  }

  // Redirect authenticated users away from login/signup pages to the home page
  if (publicPaths.includes(path) && isAuthenticated && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home page
  }

  // Redirect unauthenticated users to login page for protected routes (like /admin)
  if (path === '/admin' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
    const response = NextResponse.next();
    return response;
}



// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin', 
    '/services',
    '/products',
    '/research',
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Excludes static files
  ],
};
