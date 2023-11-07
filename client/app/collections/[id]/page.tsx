import { Suspense } from "react";
import CollectionData from "@/components/collections/[id]/CollectionData";

const CollectionPage = () => {
    return (
        <div className="pt-20 pb-10 px-4 min-h-screen box-border md:px-4 lg:px-6 2xl:container">
            <Suspense fallback={<></>}>
                <CollectionData />
            </Suspense>
        </div>
    );
};

export default CollectionPage;
