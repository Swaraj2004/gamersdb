import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendsList from "@/components/friends/FriendsList";
import Requests from "@/components/friends/Requests";
import SendRequest from "@/components/friends/SendRequest";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { getServerSession } from "next-auth/next";
import { Suspense } from "react";

const FriendsPage = async () => {
    const session = await getServerSession(options);
    if (!session) {
        return (
            <ErrorMessage message={"Login or Signup to access this page."} />
        );
    }

    return (
        <div className="pt-20 pb-10 px-4 min-h-screen box-border md:px-4 lg:px-6 2xl:container">
            <Suspense fallback={<></>}>
                <div className="grid grid-cols-[25%_46%_25%] gap-6">
                    <div className="mx-3">
                        <SendRequest />
                    </div>
                    <div className="mx-3">
                        <FriendsList />
                    </div>
                    <div className="mx-3">
                        <Requests />
                    </div>
                </div>
            </Suspense>
        </div>
    );
};

export default FriendsPage;
