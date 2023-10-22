import DisplayGames from "@/components/home/DisplayGames";
import DisplayNews from "@/components/home/DisplayNews";
import HeroSection from "@/components/home/HeroSection";
import { Suspense } from "react";
import { GameResponse } from "../types/game";
import { NewsResponse } from "../types/news";

async function getGames(limit: number): Promise<GameResponse> {
    const res = await fetch(
        `${process.env.API_URL}/games/recent_and_upcoming/${limit}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60 * 60 * 4 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getNews(limit: number): Promise<NewsResponse> {
    const res = await fetch(`${process.env.API_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit }),
        next: { revalidate: 60 * 60 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

const Home = async () => {
    const gamesRes = await getGames(25);
    const newsRes = await getNews(20);

    const recentReleases = gamesRes.result[0].result;
    const comingSoon = gamesRes.result[1].result;
    const newsArr = newsRes.result;

    return (
        <div className="my-14 px-4 md:px-4 lg:px-6 2xl:container">
            <HeroSection />
            <Suspense fallback={<p>Loading games...</p>}>
                <DisplayGames
                    games={recentReleases}
                    title={"Recently Released"}
                />
            </Suspense>
            <DisplayGames games={comingSoon} title={"Coming Soon"} />
            <DisplayNews newsArr={newsArr} title={"News"} />
        </div>
    );
};

export default Home;
