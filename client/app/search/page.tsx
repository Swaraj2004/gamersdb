import SearchedGames from "@/components/search/SearchedGames";
import { SearchGameResponse } from "@/types/game";
import ErrorMessage from "@/components/search/ErrorMessage";

async function searchGames(query: string): Promise<SearchGameResponse> {
    const res = await fetch(`${process.env.API_URL}/games/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: query }),
        next: { revalidate: 60 * 60 * 4 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

const Search = async ({ searchParams }: { searchParams: { q: string } }) => {
    if (!searchParams.q) {
        return (
            <ErrorMessage
                message={
                    "Go on and search for something by entering a keyword in the search bar above."
                }
            />
        );
    }

    const searchRes = await searchGames(searchParams.q);
    const games = searchRes.result;

    if (!games || games.length === 0) {
        return <ErrorMessage message={"No related results were found."} />;
    }

    return (
        <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
            <SearchedGames games={games} title={"Search Results"} />
        </div>
    );
};

export default Search;
