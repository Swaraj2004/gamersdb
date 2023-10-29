import axios from "axios";

const friendsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/user/friends",
});

const handle = (error: any) => {
    if (!error.response.data.success)
        throw new Error(error.response.data.message);
    return error.response.data;
};

export const getFriends = async (url: string) => {
    const res = await friendsApi.get(url); // url = `?uid=${uid}`
    return res.data;
};

export const getRequests = async (url: string) => {
    const res = await friendsApi.get(url); // url = `/requests?uid=${uid}`
    return res.data;
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
        handle(error);
    }
};

export const acceptRequest = async ({
    userId,
    requestId,
}: {
    userId: string;
    requestId: string;
}) => {
    const res = await friendsApi.post(`/requests/accept`, {
        uid: userId,
        reqid: requestId,
    });
    return res.data;
};

export const rejectRequest = async ({
    userId,
    requestId,
}: {
    userId: string;
    requestId: string;
}) => {
    const res = await friendsApi.delete(`/requests/reject`, {
        params: { uid: userId, reqid: requestId },
    });
    return res.data;
};

export const removeFriend = async ({
    userId,
    friendId,
}: {
    userId: string;
    friendId: string;
}) => {
    const res = await friendsApi.delete(`/`, {
        params: { uid: userId, fid: friendId },
    });
    return res.data;
};
