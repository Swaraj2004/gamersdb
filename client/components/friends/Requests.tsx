"use client";

import {
    acceptRequest,
    getRequests,
    rejectRequest,
} from "@/app/api/friends/friendsApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    CheckIcon,
    CounterClockwiseClockIcon,
    Cross2Icon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

const Requests = () => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const { mutate } = useSWRConfig();
    const {
        data: requests,
        isLoading,
        error,
    } = useSWR(
        uid ? `/requests?uid=${uid}` : null,
        (url) => getRequests(url, session?.accessToken),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    );

    const handleAccept = async (requestId: string) => {
        try {
            const data = await acceptRequest({
                userId: uid!,
                requestId,
                accessToken: session?.accessToken,
            });
            mutate(`?uid=${uid}`);
            mutate(`/requests?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            const data = await rejectRequest({
                userId: uid!,
                requestId,
                accessToken: session?.accessToken,
            });
            mutate(`?uid=${uid}`);
            mutate(`/requests?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    let receivedList = requests?.result?.receivedRequests?.map(
        (request: any) => {
            return (
                <li
                    className="flex border rounded-xl h-14 mt-2 py-3 px-4 items-center bg-slate-100 dark:bg-gray-950"
                    key={request._id}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={
                                request.sender.profileImg ||
                                "/profile-picture.svg"
                            }
                            alt="profile-img"
                            draggable="false"
                        />
                    </Avatar>
                    <div className="font-medium mr-auto ml-3">
                        {request.sender.username}
                    </div>
                    <div>
                        <Button
                            className="rounded-full px-2 h-8 mr-2 bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                            variant="secondary"
                            onClick={() => {
                                handleAccept(request._id);
                            }}
                        >
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            className="rounded-full px-2 h-8"
                            variant="destructive"
                            onClick={() => {
                                handleReject(request._id);
                            }}
                        >
                            <Cross2Icon className="h-4 w-4" />
                        </Button>
                    </div>
                </li>
            );
        }
    );

    let pendingList = requests?.result?.sentRequests?.map((request: any) => {
        return (
            <li
                className="flex border rounded-xl h-14 mt-2 py-3 px-4 items-center bg-slate-100 dark:bg-gray-950"
                key={request._id}
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={
                            request.recipient.profileImg ||
                            "/profile-picture.svg"
                        }
                        alt="profile-img"
                        draggable="false"
                    />
                </Avatar>
                <div className="font-medium mr-auto ml-3">
                    {request.recipient.username}
                </div>
                <div>
                    <CounterClockwiseClockIcon className="h-5 w-5" />
                </div>
            </li>
        );
    });

    return (
        <>
            <div className="text-2xl font-semibold">Requests</div>
            {error && <div>Failed to load requests.</div>}
            {session &&
                !isLoading &&
                !error &&
                requests?.result?.receivedRequests?.length !== 0 && (
                    <div className="mt-3">
                        <div className="text-muted-foreground">Recieved</div>
                        <ul>{receivedList}</ul>
                    </div>
                )}
            {session &&
                !isLoading &&
                !error &&
                requests?.result?.sentRequests?.length !== 0 && (
                    <div className="mt-3">
                        <div className="text-muted-foreground">Pending</div>
                        <ul>{pendingList}</ul>
                    </div>
                )}
            {session &&
                !isLoading &&
                !error &&
                requests?.result?.receivedRequests?.length === 0 &&
                requests?.result?.sentRequests?.length === 0 && (
                    <div className="mt-3 mx-auto">
                        No requests sent or recieved.
                    </div>
                )}
        </>
    );
};

export default Requests;
