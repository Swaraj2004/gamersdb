"use client";

import {
    deleteCollection,
    getCollections,
    getSharedCollections,
    updateCollection,
} from "@/app/api/collections/collectionsApi";
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
import { Cross2Icon, Pencil1Icon, Share1Icon } from "@radix-ui/react-icons";
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
        isValidating: isValidatingOwned,
    } = useSWR(uid && `/user/collections?uid=${uid}`, getCollections);
    console.log(ownedCollections?.result);

    const {
        data: sharedCollections,
        isLoading: isLoadingShared,
        error: errorShared,
        isValidating: isValidatingShared,
    } = useSWR(
        uid && `/user/collections/share?uid=${uid}`,
        getSharedCollections
    );
    console.log(ownedCollections?.result);

    if (isLoadingOwned || isLoadingShared)
        return (
            <>
                <div className="text-2xl font-semibold">Collections</div>
                <div className="mt-3 mx-auto">Loading...</div>
            </>
        );

    if (errorOwned || errorShared)
        return (
            <>
                <div className="text-2xl font-semibold">Collections</div>
                <div className="mt-3 mx-auto">There is an error.</div>
            </>
        );

    if (isValidatingOwned || isValidatingShared)
        return (
            <>
                <div className="text-2xl font-semibold">Collections</div>
                <div className="mt-3 mx-auto">Revalidating...</div>
            </>
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
            console.log(data);
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
            console.log(data);
            mutate(`/user/collections?uid=${uid}`);
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
                className="text-lg font-medium mr-auto ml-4 grow hover:underline"
            >
                {collection.name}
            </Link>
            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full px-2 h-8 mr-2 bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                            variant="secondary"
                        >
                            <Share1Icon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Share Collection</DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full px-2 h-8 mr-2 bg-slate-300 hover:bg-slate-200 dark:hover:bg-secondary/80 dark:bg-slate-800"
                            variant="secondary"
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
                                <Button className="w-full mt-5">
                                    Change Collection Name
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full px-2 h-8"
                            variant="destructive"
                        >
                            <Cross2Icon className="h-4 w-4" />
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
                href={`/collections/${collection._id}`}
                className="text-lg font-medium mr-auto ml-4 hover:underline"
            >
                {collection.name}
            </Link>
            <div className="absolute z-10">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="rounded-full px-2 h-8"
                            variant="destructive"
                        >
                            <Cross2Icon className="h-4 w-4" />
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
                                <Button type="button" variant="destructive">
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
                        {ownedList?.length > 0 ? (
                            ownedList
                        ) : (
                            <div className="text-center text-lg">
                                Go on and create some collections.
                            </div>
                        )}
                    </ul>
                </TabsContent>
                <TabsContent value="shared">
                    <ul className="mt-5">
                        {sharedList?.length > 0 ? (
                            sharedList
                        ) : (
                            <div className="text-center text-lg">
                                You don't have any shared collections.
                            </div>
                        )}
                    </ul>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default CollectionsList;
