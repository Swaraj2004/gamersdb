import { Suspense } from "react";
import CollectionData from "@/components/collections/[id]/CollectionData";

const CollectionPage = () => {
    return (
        <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
            <Suspense fallback={<></>}>
                <CollectionData />
            </Suspense>
        </div>
    );
};

export default CollectionPage;
