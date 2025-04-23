import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email, provider: "credentials" });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("This user signed up with Google");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      await dbConnect();

      // Handle Google Sign In
      if (account?.provider === "google" && token?.email) {
        let existingUser = await User.findOne({ email: token.email });

        if (!existingUser) {
          const newUser = await User.create({
            email: token.email,
            provider: "google", // no password needed
          });
          token.id = newUser._id.toString();
        } else {
          token.id = existingUser._id.toString();
        }
      }

      // For credentials login
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
