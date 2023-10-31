"use client";

import { sendRequest } from "@/app/api/friends/friendsApi";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

const SendRequest = () => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const [username, setUsername] = useState("");
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await sendRequest({
                userId: uid!,
                friendName: username,
            });
            setUsername("");
            mutate(`/requests?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Card className="bg-slate-100 dark:bg-gray-950">
            <CardHeader>
                <CardTitle className="text-center text-lg">
                    Add your friend on GamersDB
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your friend's username to send them a friend request.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                type="text"
                                placeholder="Enter a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-slate-300/60 focus-visible:ring-0 border-slate-300 dark:border-secondary focus-visible:border-primary dark:focus-visible:border-primary border-2 dark:bg-gray-900/80"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button className="w-full">Send Friend Request</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default SendRequest;
