"use client";

import {
    deleteCollection,
    getCollections,
    getSharedCollections,
    unshareCollection,
    updateCollection,
} from "@/app/api/collections/collectionsApi";
import ShareCollection from "@/components/collections/ShareCollection";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

const CollectionsList = () => {
    const { data: session } = useSession();
    const uid = session?.user._id;
    const { mutate } = useSWRConfig();
    const [newCollectionName, setNewCollectionName] = useState("");
    const {
        data: ownedCollections,
        isLoading: isLoadingOwned,
        error: errorOwned,
    } = useSWR(uid && `/user/collections?uid=${uid}`, getCollections);

    const {
        data: sharedCollections,
        isLoading: isLoadingShared,
        error: errorShared,
    } = useSWR(
        uid && `/user/collections/share?uid=${uid}`,
        getSharedCollections
    );

    const handleUpdate = async (
        e: React.FormEvent<HTMLFormElement>,
        collectionId: string
    ) => {
        e.preventDefault();
        try {
            const data = await updateCollection({
                collectionId,
                name: newCollectionName,
                userId: uid!,
            });
            mutate(`/user/collections?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const handleDelete = async (collectionId: string) => {
        try {
            const data = await deleteCollection({
                collectionId,
                userId: uid!,
            });
            mutate(`/user/collections?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const handleUnshare = async (collectionId: string) => {
        try {
            const data = await unshareCollection({
                friendId: uid!,
                collectionId,
            });
            mutate(`/user/collections/share?uid=${uid}`);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const ownedList = ownedCollections?.result?.map((collection: any) => (
        <li
            key={collection._id}
            className="flex border rounded-xl h-18 mt-3 py-3 px-4 items-center bg-slate-100 dark:bg-gray-950"
        >
            <Link
                href={`/collections/${collection._id}`}
                className="text-lg font-medium mr-auto ml-4 grow"
            >
                {collection.name}
            </Link>
            <div>
                <ShareCollection collection={collection} />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full mx-2 bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                            variant="secondary"
                            size="icon"
                        >
                            <Pencil1Icon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Change Collection Name</DialogTitle>
                            <DialogDescription>
                                Enter a new unique name for your collection.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => handleUpdate(e, collection._id)}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Input
                                        type="text"
                                        placeholder="Enter collection name"
                                        value={newCollectionName}
                                        onChange={(e) =>
                                            setNewCollectionName(e.target.value)
                                        }
                                        className="bg-slate-300/60 focus-visible:ring-0 border-slate-300 dark:border-secondary focus-visible:border-primary dark:focus-visible:border-primary border-2 dark:bg-gray-900/80"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose className="w-full mt-5">
                                    <Button className="w-full">
                                        Change Collection Name
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full"
                            variant="destructive"
                            size="icon"
                        >
                            <Cross1Icon className="h-4 w-4 stroke-2" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Remove Collection</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove
                                {" " + collection.name} collection?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-end">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleDelete(collection._id)}
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
            </div>
        </li>
    ));

    const sharedList = sharedCollections?.result?.map((collection: any) => (
        <li
            key={collection._id}
            className="flex border rounded-xl h-18 mt-3 py-3 px-4 items-center bg-slate-100 dark:bg-gray-950"
        >
            <Link
                href={`/collections/share/${collection._id}`}
                className="text-lg font-medium mr-auto ml-4 grow"
            >
                {collection.name}
                <span className="ml-3 text-muted-foreground">
                    ({collection.owner.username})
                </span>
            </Link>
            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full"
                            variant="destructive"
                            size="icon"
                        >
                            <Cross1Icon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Remove Collection</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove{" "}
                                {collection.name} collection?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-end">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() =>
                                        handleUnshare(collection._id)
                                    }
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
            </div>
        </li>
    ));

    return (
        <>
            <div className="text-2xl font-semibold">Collections</div>
            <Tabs defaultValue="owned" className="w-full mt-5">
                <TabsList className="bg-transparent p-0">
                    <TabsTrigger
                        value="owned"
                        className="text-lg data-[state=active]:bg-slate-200 dark:data-[state=active]:bg-slate-800"
                    >
                        Owned
                    </TabsTrigger>
                    <TabsTrigger
                        value="shared"
                        className="text-lg data-[state=active]:bg-slate-200 dark:data-[state=active]:bg-slate-800"
                    >
                        Shared
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="owned">
                    <ul className="mt-5">
                        {isLoadingOwned && (
                            <div className="text-center text-lg">
                                Loading...
                            </div>
                        )}
                        {errorOwned && (
                            <div className="text-center text-lg">
                                There is an error.
                            </div>
                        )}
                        {session &&
                            (ownedList?.length > 0 ? (
                                ownedList
                            ) : (
                                <div className="text-center text-lg">
                                    Go on and create some collections.
                                </div>
                            ))}
                    </ul>
                </TabsContent>
                <TabsContent value="shared">
                    <ul className="mt-5">
                        {isLoadingShared && (
                            <div className="text-center text-lg">
                                Loading...
                            </div>
                        )}
                        {errorShared && (
                            <div className="text-center text-lg">
                                There is an error.
                            </div>
                        )}
                        {session &&
                            (sharedList?.length > 0 ? (
                                sharedList
                            ) : (
                                <div className="text-center text-lg">
                                    You don't have any shared collections.
                                </div>
                            ))}
                    </ul>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default CollectionsList;
