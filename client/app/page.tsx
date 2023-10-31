import DisplayGames from "@/components/home/DisplayGames";
import DisplayNews from "@/components/home/DisplayNews";
import HeroSection from "@/components/home/HeroSection";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { GameResponse } from "../types/game";
import { NewsResponse } from "../types/news";

async function getGames(limit: number): Promise<GameResponse> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/recent_and_upcoming/${limit}`,
        {
            next: { revalidate: 60 * 60 * 4 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getNews(limit: number): Promise<NewsResponse> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news?limit=${limit}`,
        {
            next: { revalidate: 60 * 60 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

const Home = async () => {
    try {
        const gamesRes = await getGames(25);
        const newsRes = await getNews(20);

        const recentReleases = gamesRes.result[0].result;
        const comingSoon = gamesRes.result[1].result;
        const newsArr = newsRes.result;

        return (
            <div className="my-14 px-4 md:px-4 lg:px-6 2xl:container">
                <HeroSection />
                <DisplayGames
                    games={recentReleases}
                    title={"Recently Released"}
                />
                <DisplayGames games={comingSoon} title={"Coming Soon"} />
                <DisplayNews newsArr={newsArr} title={"News"} />
            </div>
        );
    } catch (error: any) {
        return <ErrorMessage message="Something went wrong." />;
    }
};

export default Home;
