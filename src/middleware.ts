// import withAuth from "next-auth/middleware";
// import { NextRequest, NextResponse } from "next/server";

// export default withAuth(
//     function middleware(){  //its written in documentation that
//         //this function will only be evoked if authorized return true
//         return NextResponse.next()
//     },
//     {
//         callbacks:{
//             authorized:({token,req})=>{
//                 const {pathname} = req.nextUrl;
//                 if(
//                     pathname.startsWith("/api/auth") ||
//                     pathname === "/login" ||
//                     pathname === "/register"
//                 ){
//                     return true
//                 }
//                 //public
//                 if(pathname === "/" || pathname.startsWith("api/videos")){
//                     return true
//                 }

//                 return !!token //if token is present then user is authenticated
//                 // !token means no token and !! means true or false
//             }
//         }
//     }
// )
// export const config = {
//     matcher:[
//         "/((?!_next/static|_next/image|favicon.ico|public/).*)",
//     ]
// }
// import { NextRequest , NextResponse } from 'next/server'
// export { default } from "next-auth/middleware"
// import { getToken } from "next-auth/jwt"


// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const token = await getToken({req:request})
//     const url = request.nextUrl
//     if(token &&
//         (
//             url.pathname.startsWith('/sign-in') ||
//             url.pathname.startsWith('/sign-up') ||
//             url.pathname.startsWith('/verify') ||
//             url.pathname.startsWith('/')
//         ))
//         {
//             return NextResponse.redirect(new URL('/dashboard', request.url))   
//     }
//     if(!token && url.pathname.startsWith('/dashboard')){
//         return NextResponse.redirect(new URL('/sign-in', request.url))
//     }
//     return NextResponse.next()
// }
 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     '/sign-in',
//     '/sign-up',
//     '/',
//     '/dashboard/:path*',
//     '/verify/:path*'
// ],
// }
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  if (
    token &&
    (
      url.pathname === '/' || 
      url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/register')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
  ],
}
