"use client";

import { getFriends, removeFriend } from "@/app/api/friends/friendsApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

const FriendsList = () => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const { mutate } = useSWRConfig();
    const {
        data: friends,
        isLoading,
        error,
    } = useSWR(
        uid ? `?uid=${uid}` : null,
        (url) => getFriends(url, session?.accessToken),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    );

    const handleRemove = async (friendId: string) => {
        try {
            const data = await removeFriend({
                userId: uid!,
                friendId,
                accessToken: session?.accessToken,
            });
            mutate(`?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const friendsList = friends?.result?.map((friend: any) => (
        <li
            key={friend._id}
            className="flex border rounded-xl h-18 mt-3 py-3 px-4 items-center bg-slate-100 dark:bg-gray-950"
        >
            <Avatar>
                <AvatarImage
                    src="/profile-picture.svg"
                    alt="profile-img"
                    draggable="false"
                />
            </Avatar>
            <div className="text-lg font-medium mr-auto ml-4">
                {friend.username}
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                        variant="secondary"
                    >
                        Remove
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[340px] sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Remove Friend</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {friend.username}{" "}
                            from your friends?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleRemove(friend._id)}
                            >
                                Yes
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                No
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </li>
    ));

    return (
        <>
            <div className="text-2xl font-semibold">Friends</div>
            <ul className="mt-5">
                {isLoading && (
                    <div className="text-center text-lg">Loading...</div>
                )}
                {error && (
                    <div className="text-center text-lg">
                        Failed to load friends.
                    </div>
                )}
                {session &&
                    !error &&
                    !isLoading &&
                    (friendsList?.length > 0 ? (
                        friendsList
                    ) : (
                        <div className="text-center text-lg">
                            You don't have any friends.
                        </div>
                    ))}
            </ul>
        </>
    );
};

export default FriendsList;
