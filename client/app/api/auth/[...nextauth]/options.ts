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

                // If no error and we have user data, return it
                if (res.ok && user) {
                    // Make sure the returned object has an `id` property
                    return {
                        id: user.user._id, // Add the `id` property
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        accessTokenExpires: Date.now() + 15 * 60 * 1000,
                        email: user.user.email,
                        username: user.user.username,
                        profileImg: user.user.profileImg ?? null,
                    };
                } else {
                    throw new Error(JSON.stringify(user));
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires;
                token.id = user.id; // Store the user id in the JWT token
                token.email = user.email;
                token.username = user.username;
                token.profileImg = user.profileImg;
            }

            // Check if access token has expired
            if (Date.now() < (token.accessTokenExpires as number)) {
                return { ...token, ...user };
            }

            // Access token has expired, try to refresh it
            return await refreshAccessToken(token);
        },
        async session({ session, token, user }) {
            session.user = {
                _id: token.id as string, // Ensure user ID is added to the session
                email: token.email as string,
                username: token.username as string,
                profileImg: token.profileImg as string | null,
            };
            session.accessToken = token.accessToken as string;

            return session;
        },
    },
};

async function refreshAccessToken(token: any) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken: token.refreshToken,
                }),
            }
        );

        const refreshedTokens = await res.json();

        if (!res.ok) {
            throw refreshedTokens;
        }

        // Return new tokens and expiration time
        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
            refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Use new refresh token if provided
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        // Remove tokens if refresh fails
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
