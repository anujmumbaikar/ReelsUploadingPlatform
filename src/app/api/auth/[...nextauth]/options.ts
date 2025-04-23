import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email", type:"text", placeholder:"email"},
                password:{label:"Password", type:"password", placeholder:"password"}
            },
            async authorize(credentials,req){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing credentials");
                }
                try {
                    await dbConnect();
                    const user = await User.findOne({email:credentials.email})
                    if(!user){
                        throw new Error("User not found");
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if(!isValid){
                        throw new Error("Invalid password");
                    }
                    return {  //this is the user object that will be returned in the session
                        id:user._id.toString(),
                        email:user.email
                    }
                } catch (error) {
                    console.log("Error in authorize",error);
                    throw new Error("Error in authorize");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization:{
                params:{
                    prompt:"consent",
                    access_type:"offline",
                    response_type:"code",
                }
            }
          })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id as string
                token.email = user.email as string
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        }
    },
    pages:{
        signIn:"/login",
        error:"/login",
    },
    session:{
        strategy:"jwt",
        maxAge:10*24*60*60,
    },
    secret: process.env.NEXTAUTH_SECRET
};

export default authOptions;
