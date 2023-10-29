import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                username: {},
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
                    {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const user = await res.json();

                console.log(user);
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user.result;
                }
                // Return user.message which will be passed to NextAuth as `errorMessage` in the event of an error
                else {
                    // Return an object that will pass error information through to the client-side.
                    throw new Error(JSON.stringify(user));
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token as any;
            return session;
        },
    },
};
