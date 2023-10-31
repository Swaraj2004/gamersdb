import AddToCollection from "@/components/game/[slug]/AddToCollection";
import GameInfo from "@/components/game/[slug]/GameInfo";
import Rating from "@/components/game/[slug]/Rating";
import Screenshots from "@/components/game/[slug]/Screenshots";
import { GameDataResponse } from "@/types/gamedata";
import Image from "next/image";
import ErrorMessage from "@/components/shared/ErrorMessage";

async function getGameData(slug: string): Promise<GameDataResponse> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/gamedata/${slug}`,
        {
            next: { revalidate: 60 * 60 * 12 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

const GameData = async ({ params }: { params: { slug: string } }) => {
    try {
        const gameRes = await getGameData(params.slug);
        const game = gameRes.result;
        const addgame = {
            name: game.name,
            slug: params.slug,
            genre: game.genres?.[0] || null,
            coverUrl: game.cover_url,
        };

        return (
            <div className="relative">
                <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
                    <div className="absolute -z-20 top-0 left-0 right-0 -translate-y-14">
                        <Image
                            src={game?.screenshots?.[0] || "/gamebg.png"}
                            width="1920"
                            height="1080"
                            className="object-cover blur-sm h-[380px] mx-auto filter dark:brightness-75"
                            quality={100}
                            alt="."
                        />
                    </div>
                    <div className="grid grid-cols-[25%_65%_10%] max-w-6xl mx-auto">
                        <div className="mt-8 row-span-2">
                            <Image
                                src={game.cover_url || "/cover-missing.jpg"}
                                width={432}
                                height={576}
                                quality={100}
                                className="object-cover w-[270px] h-[360px] border-4 bg-background border-gray-700 dark:border-gray-100 rounded-xl"
                                draggable="false"
                                alt="Game Cover"
                            />
                            <AddToCollection addgame={addgame} />
                        </div>
                        <div className="flex h-60">
                            <div className="mt-20 mx-3">
                                <div className="text-5xl pb-3 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                    {game.name}
                                </div>
                                <div className="text-3xl mb-1 text-gray-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                    {game.release_date}
                                </div>
                            </div>
                        </div>
                        <Rating rating={game.rating || "N/A"} />
                        <GameInfo game={game} />
                    </div>
                    {game.screenshots && (
                        <div className="my-16 max-w-6xl mx-auto">
                            <Screenshots urls={game.screenshots} />
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error: any) {
        <ErrorMessage message="Something went wrong." />;
    }
};

export default GameData;
