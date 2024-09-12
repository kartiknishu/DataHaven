import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // const token = getLocalStorage('authToken');
  const token = request.cookies.get('_auth_resource_tkn');
  // console.log(token)
  if(!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }


  return NextResponse.next();

}

export const config = {
  matcher:["/",
          "/academics/:path*",
          "/profile/:path*",
          "/team/:path*"
        ],
};