import nextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        user: {
            _id: string;
            username: string;
            email: string;
            profileImg: string | null;
        };
    }

    interface User {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        id?: string;
        email?: string;
        username?: string;
        profileImg?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        user?: {
            _id?: string;
            username?: string;
            email?: string;
            profileImg?: string | null;
        };
    }
}
