import { errorHandler } from "@/lib/utils";
import axios from "axios";

const friendsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/user/friends",
});

const addAuthHeader = (accessToken: string | undefined) => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const getFriends = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `?uid=${uid}`
        const res = await friendsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        console.error("Error fetching friends:", error);
        throw error;
    }
};

export const getRequests = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `/requests?uid=${uid}`
        const res = await friendsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const sendRequest = async ({
    userId,
    friendName,
    accessToken,
}: {
    userId: string;
    friendName: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await friendsApi.post(
            "/requests",
            {
                uid: userId,
                fname: friendName,
            },
            {
                headers: addAuthHeader(accessToken),
            }
        );
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const acceptRequest = async ({
    userId,
    requestId,
    accessToken,
}: {
    userId: string;
    requestId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await friendsApi.post(
            "/requests/accept",
            {
                uid: userId,
                reqid: requestId,
            },
            {
                headers: addAuthHeader(accessToken),
            }
        );
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const rejectRequest = async ({
    userId,
    requestId,
    accessToken,
}: {
    userId: string;
    requestId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await friendsApi.delete("/requests/reject", {
            params: { uid: userId, reqid: requestId },
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const removeFriend = async ({
    userId,
    friendId,
    accessToken,
}: {
    userId: string;
    friendId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await friendsApi.delete("", {
            params: { uid: userId, fid: friendId },
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};
