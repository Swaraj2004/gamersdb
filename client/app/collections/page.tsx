import { options } from "@/app/api/auth/[...nextauth]/options";
import CollectionsList from "@/components/collections/CollectionsList";
import CreateCollection from "@/components/collections/CreateCollection";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { getServerSession } from "next-auth/next";
import { Suspense } from "react";

const CollectionsPage = async () => {
    const session = await getServerSession(options);
    if (!session) {
        return (
            <ErrorMessage message={"Login or Signup to access this page."} />
        );
    }

    return (
        <div className="my-20 px-4 md:px-4 lg:px-6 2xl:container">
            <Suspense fallback={<></>}>
                <div className="grid grid-cols-[27%_70%] gap-6">
                    <div className="mx-3">
                        <CreateCollection />
                    </div>
                    <div className="mx-3">
                        <CollectionsList />
                    </div>
                </div>
            </Suspense>
        </div>
    );
};

export default CollectionsPage;
