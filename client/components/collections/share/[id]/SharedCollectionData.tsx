"use client";

import { getSharedCollection } from "@/app/api/collections/collectionsApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

const CollectionData = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const uid = session?.user._id;
    const params = useParams();
    const collid = params.id as string;

    const {
        data: colldata,
        isLoading,
        error,
    } = useSWR(
        uid && `/user/collection/share?uid=${uid}&collid=${collid}`,
        getSharedCollection
    );
    console.log(colldata);
    const games = colldata?.result?.games;

    if (isLoading)
        return (
            <div>
                <div className="text-2xl font-semibold">Collection</div>
                <div className="mt-3 mx-auto">Loading...</div>
            </div>
        );
    if (error)
        return (
            <div>
                <div className="text-2xl font-semibold">Collection</div>
                <div className="mt-3 mx-auto">
                    {error.response.data.message}
                </div>
            </div>
        );

    const openGame = (slug: string) => {
        router.push("/game/" + slug);
    };

    const gamesList = games?.map((game: any) => (
        <li key={game.slug}>
            <Card
                onClick={() => openGame(game.slug)}
                className="relative group h-[304px] w-[200px] bg-slate-200 dark:bg-slate-900 border-0 drop-shadow-md dark:border"
            >
                <CardContent className="p-0 h-[267px] overflow-hidden rounded-xl">
                    <Image
                        src={game.coverUrl || "/cover-missing.jpg"}
                        width={220}
                        height={294}
                        quality={100}
                        className="object-cover w-[200px] h-[267px] hover:scale-105 hover:origin-center duration-300 ease-in-out"
                        draggable="false"
                        alt="Game Cover"
                    />
                </CardContent>
                <CardHeader className="grid p-0 px-3 h-[36px]">
                    <CardTitle className="my-auto leading-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
                        {game.name}
                    </CardTitle>
                </CardHeader>
            </Card>
        </li>
    ));

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold">
                {colldata?.result.collection}
                <ChevronRightIcon className="inline h-6 w-6 mb-1" />
            </h3>
            <hr className="mt-2 mb-4" />
            <ul className="flex justify-center flex-wrap gap-4">
                {gamesList?.length > 0 ? (
                    gamesList
                ) : (
                    <ErrorMessage
                        message={"No games added in this collection."}
                    />
                )}
            </ul>
        </div>
    );
};

export default CollectionData;
