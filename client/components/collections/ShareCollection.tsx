"use client";

import { shareCollection } from "@/app/api/collections/collectionsApi";
import { getFriends } from "@/app/api/friends/friendsApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Share1Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR from "swr";

const ShareCollection = ({ collection }: any) => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const {
        data: friends,
        isLoading,
        error,
    } = useSWR(uid && `?uid=${uid}`, getFriends);

    const handleShare = async (reqbody: {
        userId: string;
        friendId: string;
        collectionId: string;
    }) => {
        try {
            const data = await shareCollection(reqbody);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const friendsList = friends?.result?.map((friend: any) => {
        const reqbody = {
            userId: uid!,
            friendId: friend._id,
            collectionId: collection._id,
        };
        return (
            <li
                className="flex border rounded-xl h-12 mt-2 py-3 px-3 items-center bg-slate-100 dark:bg-gray-950"
                key={friend._id}
            >
                <div className="font-medium mr-auto ml-1">
                    {friend.username}
                </div>
                <div>
                    <Button
                        className="px-4 h-7"
                        onClick={() => {
                            handleShare(reqbody);
                        }}
                    >
                        Share
                    </Button>
                </div>
            </li>
        );
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="rounded-full bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                    variant="secondary"
                    size="icon"
                >
                    <Share1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] h-[500px] sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="mb-4">Share Collection</DialogTitle>
                    {session && (
                        <ul>
                            {friendsList?.length > 0
                                ? friendsList
                                : "No friends found"}
                        </ul>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ShareCollection;
