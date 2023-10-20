import HeroSection from "@/components/HeroSection";
import DisplayGames from "@/components/DisplayGames";
import DisplayNews from "@/components/DisplayNews";

async function getGames() {
    const res = await fetch(
        "https://api-gamersdb.onrender.com/games/recent_and_upcoming/25",
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60 * 60 * 6 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
async function getNews() {
    const res = await fetch("https://api-gamersdb.onrender.com/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 * 30 },
        body: JSON.stringify({ limit: 20 }),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Home() {
    const games = await getGames();
    const newsRes = await getNews();

    const recentReleases = games.result[0].result;
    const comingSoon = games.result[1].result;
    const newsArr = newsRes.result;

    return (
        <div className="my-14 px-4 md:px-4 lg:px-6 2xl:container">
            <HeroSection />
            <DisplayGames games={recentReleases} title={"Recently Released"} />
            <DisplayGames games={comingSoon} title={"Coming Soon"} />
            <DisplayNews newsArr={newsArr} title={"News"} />
        </div>
    );
}
