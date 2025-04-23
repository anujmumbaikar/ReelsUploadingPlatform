import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    function middleware(){  //its written in documentation that
        //this function will only be evoked if authorized return true
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname} = req.nextUrl;
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true
                }

                //public
                if(pathname === "/" || pathname.startsWith("api/videos")){
                    return true
                }

                return !!token //if token is present then user is authenticated
                // !token means no token and !! means true or false
            }
        }
    }
)
export const config = {
    matcher:[
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ]
}