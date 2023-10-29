"use client";

import { addGame, getCollections } from "@/app/api/collections/collectionsApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Collection } from "@/types/collections";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR from "swr";

const AddToCollection = ({
    addgame,
}: {
    addgame: {
        name: string;
        slug: string;
        genre: string | null;
        coverUrl: string | null;
    };
}) => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const {
        data: collections,
        isLoading,
        error,
    } = useSWR(uid && `/user/collections?uid=${uid}`, getCollections);
    console.log(collections?.result);

    const handleAdd = async (reqbody: {
        userId: string;
        collectionId: string;
        name: string;
        slug: string;
        genre: string | null;
        coverUrl: string | null;
    }) => {
        try {
            const data = await addGame(reqbody);
            console.log(data);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const collectionsList = collections?.result?.map((coll: Collection) => {
        const reqbody = {
            userId: uid!,
            collectionId: coll._id,
            name: addgame.name,
            slug: addgame.slug,
            genre: addgame.genre,
            coverUrl: addgame.coverUrl,
        };
        return (
            <li
                className="flex border rounded-xl h-12 mt-2 py-3 px-3 items-center bg-slate-100 dark:bg-gray-950"
                key={coll._id}
            >
                <div className="font-medium mr-auto ml-1">{coll.name}</div>
                <div>
                    <Button
                        className="px-4 h-7"
                        onClick={() => {
                            handleAdd(reqbody);
                        }}
                    >
                        Add
                    </Button>
                </div>
            </li>
        );
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-4 w-[270px] font-semibold text-lg">
                    Add to collection
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] h-[500px] sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="mb-4">
                        Add to collection
                    </DialogTitle>
                    {session ? (
                        <ul>
                            {collectionsList?.length > 0
                                ? collectionsList
                                : "No Collections found"}
                        </ul>
                    ) : (
                        "Login or Signup to use this feature"
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddToCollection;
