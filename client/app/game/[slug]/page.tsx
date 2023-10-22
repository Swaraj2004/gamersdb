import { GameDataResponse } from '@/types/gamedata';

async function getGameData(slug: string): Promise<GameDataResponse> {
    const res = await fetch(`${process.env.API_URL}/games/gamedata/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 * 60 * 4 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

const GameData = async ({params}: {params: {slug: string}}) => {
    console.log(params.slug)
    const gameDataRes = await getGameData(params.slug);
    console.log(gameDataRes);

    return <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
        <h1>Game Data</h1>
    </div>
};

export default GameData;
