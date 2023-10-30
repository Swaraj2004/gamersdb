import axios from "axios";

const collectionsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getCollection = async (url: string) => {
    const res = await collectionsApi.get(url); // url = `/user/collection?uid=${uid}&collid=${collid}`
    return res.data;
};

export const getSharedCollection = async (url: string) => {
    const res = await collectionsApi.get(url); // url = `/user/collection/share?uid=${uid}&collid=${collid}`
    return res.data;
};

export const addGame = async ({
    userId,
    collectionId,
    name,
    slug,
    genre,
    coverUrl,
}: {
    userId: string;
    collectionId: string;
    name: string;
    slug: string;
    genre: string | null;
    coverUrl: string | null;
}) => {
    const res = await collectionsApi.post(`/user/collection`, {
        uid: userId,
        collid: collectionId,
        name,
        slug,
        genre,
        coverUrl,
    });
    return res.data;
};

export const removeGame = async ({
    userId,
    collectionId,
    slug,
}: {
    userId: string;
    collectionId: string;
    slug: string;
}) => {
    const res = await collectionsApi.delete(`/user/collection`, {
        params: {
            uid: userId,
            collid: collectionId,
            slug,
        },
    });
    return res.data;
};

export const getCollections = async (url: string) => {
    const res = await collectionsApi.get(url); // url = `/user/collections?uid=${uid}`
    return res.data;
};

export const createCollection = async ({
    userId,
    name,
}: {
    userId: string;
    name: string;
}) => {
    const res = await collectionsApi.post(`/user/collections`, {
        uid: userId,
        name,
    });
    return res.data;
};

export const updateCollection = async ({
    collectionId,
    name,
    userId,
}: {
    collectionId: string;
    name: string;
    userId: string;
}) => {
    const res = await collectionsApi.patch(`/user/collections`, {
        collid: collectionId,
        name,
        uid: userId,
    });
    console.log(res.data);
    return res.data;
};

export const deleteCollection = async ({
    collectionId,
    userId,
}: {
    collectionId: string;
    userId: string;
}) => {
    const res = await collectionsApi.delete(`/user/collections`, {
        params: {
            collid: collectionId,
            uid: userId,
        },
    });
    return res.data;
};

export const getSharedCollections = async (url: string) => {
    const res = await collectionsApi.get(url); // url = `/user/collections/share/?uid=${uid}`
    return res.data;
};

export const sharedWith = async ({
    collectionId,
    userId,
}: {
    collectionId: string;
    userId: string;
}) => {
    const res = await collectionsApi.post(`/user/collections/share/users`, {
        collid: collectionId,
        uid: userId,
    });
    return res.data;
};

export const shareCollection = async ({
    userId,
    friendId,
    collectionId,
}: {
    userId: string;
    friendId: string;
    collectionId: string;
}) => {
    const res = await collectionsApi.post(`/user/collections/share/users`, {
        uid: userId,
        fid: friendId,
        collid: collectionId,
    });
    return res.data;
};

export const unshareCollection = async ({
    // userId,
    friendId,
    collectionId,
}: {
    // userId: string;
    friendId: string;
    collectionId: string;
}) => {
    const res = await collectionsApi.delete(`/user/collections/share/users`, {
        params: {
            // uid: userId,
            fid: friendId,
            collid: collectionId,
        },
    });
    return res.data;
};
