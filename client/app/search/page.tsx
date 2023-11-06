import SearchedGames from "@/components/search/SearchedGames";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { SearchGameResponse } from "@/types/game";
import { log } from "console";
import { Suspense } from "react";

async function searchGames(name: string): Promise<SearchGameResponse> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/search?name=${name}`,
        {
            next: { revalidate: 60 * 60 * 6 },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

const Search = async ({ searchParams }: { searchParams: { name: string } }) => {
    if (!searchParams.name) {
        return (
            <ErrorMessage
                message={
                    "Go on and search for something by entering a keyword in the search bar above."
                }
            />
        );
    }

    try {
        const searchRes = await searchGames(searchParams.name);
        const games = JSON.stringify(searchRes.result);

        if (!games || searchRes.result.length === 0) {
            return <ErrorMessage message={"No related results were found."} />;
        }

        return (
            <div className="my-16 px-4 md:px-4 lg:px-6 2xl:container">
                <Suspense fallback={<></>}>
                    <SearchedGames games={games} title={"Search Results"} />
                </Suspense>
            </div>
        );
    } catch (error: any) {
        return <ErrorMessage message={error} />;
    }
};

export default Search;
