import { errorHandler } from "@/lib/utils";
import axios from "axios";

const friendsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/user/friends",
});

export const getFriends = async (url: string) => {
    try {
        const res = await friendsApi.get(url); // url = `?uid=${uid}`
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const getRequests = async (url: string) => {
    try {
        const res = await friendsApi.get(url); // url = `/requests?uid=${uid}`
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const sendRequest = async ({
    userId,
    friendName,
}: {
    userId: string;
    friendName: string;
}) => {
    try {
        const res = await friendsApi.post(`/requests`, {
            uid: userId,
            fname: friendName,
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const acceptRequest = async ({
    userId,
    requestId,
}: {
    userId: string;
    requestId: string;
}) => {
    try {
        const res = await friendsApi.post(`/requests/accept`, {
            uid: userId,
            reqid: requestId,
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const rejectRequest = async ({
    userId,
    requestId,
}: {
    userId: string;
    requestId: string;
}) => {
    try {
        const res = await friendsApi.delete(`/requests/reject`, {
            params: { uid: userId, reqid: requestId },
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const removeFriend = async ({
    userId,
    friendId,
}: {
    userId: string;
    friendId: string;
}) => {
    try {
        const res = await friendsApi.delete(`/`, {
            params: { uid: userId, fid: friendId },
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};
