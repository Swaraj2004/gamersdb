import { Suspense } from "react";
import SharedCollectionData from "@/components/collections/share/[id]/SharedCollectionData";

const SharedCollectionPage = () => {
    return (
        <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
            <Suspense fallback={<></>}>
                <SharedCollectionData />
            </Suspense>
        </div>
    );
};

export default SharedCollectionPage;
