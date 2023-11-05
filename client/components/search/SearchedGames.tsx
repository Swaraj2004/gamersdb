"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game } from "@/types/game";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import Image from "next/image";
import Link from "next/link";

interface GamesProps {
    games: string;
    title: String;
}

const SearchedGames: React.FC<GamesProps> = ({ games, title }) => {
    const gamesArr: Game[] = JSON.parse(games);

    const recentList = gamesArr.map((game: Game) => (
        <div key={game.slug}>
            <Link href={"/game/" + game.slug}>
                <Card className="h-[304px] w-[200px] bg-slate-200 dark:bg-slate-900 border-0 drop-shadow-md dark:border">
                    <CardContent className="p-0 h-[267px] overflow-hidden rounded-xl">
                        <Image
                            src={game.cover_url || "/cover-missing.jpg"}
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
            </Link>
        </div>
    ));

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold">
                {title}
                <ChevronRightIcon className="inline h-6 w-6 mb-1" />
            </h3>
            <hr className="mt-2 mb-4" />
            <div className="flex justify-center flex-wrap gap-4">
                {recentList}
            </div>
        </div>
    );
};

export default SearchedGames;
