"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { News } from "@/types/news";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import Image from "next/image";
import Link from "next/link";

interface NewsProps {
    newsArr: News[];
    title: String;
}

export const splideOptions: any = {
    perPage: 3,
    perMove: 1,
    autoWidth: true,
    pagination: false,
    keyboard: "focused",
    gap: "1rem",
    drag: "free",
    snap: true,
    mediaQuery: "min",
    breakpoints: {
        1024: { perMove: 2 },
    },
};

const DisplayNews: React.FC<NewsProps> = ({ newsArr, title }) => {
    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    }

    const recentList = newsArr.map((news: News) => (
        <SplideSlide key={news.url}>
            <Link href={news.url} target="_blank">
                <Card className="flex flex-col my-2 min-h-[493px] sm:min-h-[484px] w-72 sm:w-96 bg-slate-200 dark:bg-slate-900 border-0 drop-shadow-md dark:border">
                    <CardContent className="p-0 overflow-hidden rounded-xl aspect-40/21">
                        <Image
                            src={news.urlToImage}
                            width={1200}
                            height={675}
                            sizes=""
                            quality={100}
                            className="object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out"
                            draggable="false"
                            alt="News Cover"
                        />
                    </CardContent>
                    <CardHeader>
                        <CardTitle className="leading-5">
                            {news.title}
                        </CardTitle>
                        <CardDescription>{news.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-grow">
                        <span className="mt-auto">{news.source}</span>
                        <span className="ml-auto text-muted-foreground  mt-auto">
                            {formatDate(news.publishedAt)}
                        </span>
                    </CardFooter>
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

export default DisplayNews;
