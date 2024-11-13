import { errorHandler } from "@/lib/utils";
import axios from "axios";

const collectionsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const addAuthHeader = (accessToken: string | undefined) => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const getCollection = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `/user/collection?uid=${uid}&collid=${collid}`
        const res = await collectionsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const getSharedCollection = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `/user/collection?uid=${uid}&collid=${collid}`
        const res = await collectionsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const addGame = async ({
    userId,
    collectionId,
    name,
    slug,
    genre,
    coverUrl,
    accessToken,
}: {
    userId: string;
    collectionId: string;
    name: string;
    slug: string;
    genre: string | null;
    coverUrl: string | null;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.post(
            "/user/collection",
            {
                uid: userId,
                collid: collectionId,
                name,
                slug,
                genre,
                coverUrl,
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

export const removeGame = async ({
    userId,
    collectionId,
    slug,
    accessToken,
}: {
    userId: string;
    collectionId: string;
    slug: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.delete("/user/collection", {
            params: {
                uid: userId,
                collid: collectionId,
                slug,
            },
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const getCollections = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `/user/collections?uid=${uid}`
        const res = await collectionsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const createCollection = async ({
    userId,
    name,
    accessToken,
}: {
    userId: string;
    name: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.post(
            "/user/collections",
            {
                uid: userId,
                name,
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

export const updateCollection = async ({
    collectionId,
    name,
    userId,
    accessToken,
}: {
    collectionId: string;
    name: string;
    userId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.patch(
            "/user/collections",
            {
                collid: collectionId,
                name,
                uid: userId,
            },
            {
                headers: addAuthHeader(accessToken),
            }
        );
        console.log(res.data);
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const deleteCollection = async ({
    collectionId,
    userId,
    accessToken,
}: {
    collectionId: string;
    userId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.delete("/user/collections", {
            params: {
                collid: collectionId,
                uid: userId,
            },
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const getSharedCollections = async (
    url: string,
    accessToken: string | undefined
) => {
    try {
        // url = `/user/collections/share/?uid=${uid}`
        const res = await collectionsApi.get(url, {
            headers: addAuthHeader(accessToken),
        });
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};

export const sharedWith = async ({
    collectionId,
    userId,
    accessToken,
}: {
    collectionId: string;
    userId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.post(
            "/user/collections/share/users",
            {
                collid: collectionId,
                uid: userId,
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

export const shareCollection = async ({
    userId,
    friendId,
    collectionId,
    accessToken,
}: {
    userId: string;
    friendId: string;
    collectionId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.post(
            "/user/collections/share/users",
            {
                uid: userId,
                fid: friendId,
                collid: collectionId,
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

export const unshareCollection = async ({
    friendId,
    collectionId,
    accessToken,
}: {
    friendId: string;
    collectionId: string;
    accessToken: string | undefined;
}) => {
    try {
        const res = await collectionsApi.delete(
            "/user/collections/share/users",
            {
                params: {
                    // uid: userId,
                    fid: friendId,
                    collid: collectionId,
                },
                headers: addAuthHeader(accessToken),
            }
        );
        return res.data;
    } catch (error: any) {
        errorHandler(error);
    }
};
