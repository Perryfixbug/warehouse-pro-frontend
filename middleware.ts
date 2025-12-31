import { NextRequest, NextResponse } from 'next/server'

const AUTH_PAGES = ['/login', '/reset-password', '/forgot-password']

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')
  
  const pathname = req.nextUrl.pathname
  const isAuthPage = AUTH_PAGES.some(page =>
    pathname === page || pathname.startsWith(`${page}/`)
  )

  if (!isAuthPage && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

