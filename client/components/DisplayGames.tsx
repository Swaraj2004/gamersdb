"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GamesProps {
    games: Game[];
    title: String;
}

interface Game {
    id: number;
    name: string;
    slug: string;
    cover_url: string | null;
}

export const splideOptions: any = {
    perMove: 3,
    fixedWidth: 220,
    keyboard: "focused",
    gap: "1rem",
    pagination: false,
    drag: "free",
    snap: true,
    breakpoints: {
        1024: { perMove: 2 },
        786: { perMove: 1 },
    },
};

const DisplayGames: React.FC<GamesProps> = ({ games, title }) => {
    const recentList = games.map((game: Game) => (
        <SplideSlide key={game.slug}>
            <Link href={"/game/" + game.slug}>
                <Card className="my-2 h-[334px] bg-slate-200 dark:bg-slate-900 border-0 drop-shadow-md dark:border">
                    <CardContent className="p-0 h-[294px] overflow-hidden rounded-xl">
                        <Image
                            src={game.cover_url || "/cover-missing.jpg"}
                            width={220}
                            height={294}
                            quality={100}
                            className="object-cover w-[220px] h-[294px] hover:scale-105 hover:origin-center duration-300 ease-in-out"
                            draggable="false"
                            alt="Game Cover"
                        />
                    </CardContent>
                    <CardHeader className="grid p-0 px-3 h-[40px]">
                        <CardTitle className="my-auto overflow-hidden text-ellipsis whitespace-nowrap text-center">
                            {game.name}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </Link>
        </SplideSlide>
    ));

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
                {title}
                <ChevronRightIcon className="inline h-6 w-6 mb-1" />
            </h3>
            <Splide options={splideOptions} aria-label="Coming Soon">
                {recentList}
            </Splide>
        </div>
    );
};

export default DisplayGames;
